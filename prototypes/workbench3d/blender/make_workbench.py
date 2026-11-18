# Builds the Halo Workbench desk device and exports it as one GLB with separately named, animatable parts.
# Run headless:  blender -b --factory-startup --python make_workbench.py -- <out.glb>
# Units are metres. Blender is Z-up; the glTF export converts to Y-up for the browser.
import sys
import math
import bpy
import bmesh

out = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "workbench.glb"

# empty scene
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete()
for block in (bpy.data.meshes, bpy.data.materials):
    for item in list(block):
        block.remove(item)


def material(name, rgb, rough, metal=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = (*rgb, 1.0)
    p.inputs["Roughness"].default_value = rough
    p.inputs["Metallic"].default_value = metal
    return m


def srgb(h):
    """Hex sRGB to linear, so colours match the design swatches."""
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


M_BODY = material("mat_body", srgb("e7e2d8"), 0.55)
M_PLATE = material("mat_plate", srgb("d9d3c7"), 0.6)
M_KEY = material("mat_key", srgb("f7f4ed"), 0.42)
M_GO = material("mat_go", srgb("ff5a1f"), 0.38)
M_GLASS = material("mat_glass", srgb("141414"), 0.08)
M_KNOB = material("mat_knob", srgb("b9b6b0"), 0.32, 1.0)
M_MARK = material("mat_mark", srgb("111111"), 0.5)


def finish(obj, mat, bevel=None, segments=5, smooth=True):
    obj.data.materials.append(mat)
    if bevel:
        mod = obj.modifiers.new("bevel", "BEVEL")
        mod.width = bevel
        mod.segments = segments
        mod.limit_method = "ANGLE"
        mod.angle_limit = math.radians(40)
    if smooth:
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.ops.object.shade_auto_smooth(angle=math.radians(35))
        obj.select_set(False)
    return obj


def box(name, w, d, h, x=0.0, y=0.0, z=0.0, top_scale=1.0):
    """A box sitting on z with its origin at the bottom centre; top_scale < 1 tapers it like a keycap."""
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= w
        v.co.y *= d
        v.co.z = (v.co.z + 0.5) * h
        if v.co.z > h * 0.5:
            v.co.x *= top_scale
            v.co.y *= top_scale
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = (x, y, z)
    return obj


def dish(obj, w, h, depth=0.0012):
    """Scoop the top face gently, like a sculpted keycap: boolean with a big sphere."""
    r = max(w, 0.08) * 2.6
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, segments=96, ring_count=48, location=(obj.location.x, obj.location.y, obj.location.z + h + r - depth))
    cutter = bpy.context.active_object
    mod = obj.modifiers.new("dish", "BOOLEAN")
    mod.operation = "DIFFERENCE"
    mod.object = cutter
    mod.solver = "EXACT"
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier="dish")
    bpy.data.objects.remove(cutter, do_unlink=True)


# chassis: one soft slab with a slightly lower plate where the keys sit
W, D, H = 0.30, 0.345, 0.026
finish(box("chassis", W, D, H, 0, 0, 0), M_BODY, bevel=0.012, segments=8)
finish(box("plate", 0.275, 0.17, 0.003, 0, -0.005, H - 0.0015), M_PLATE, bevel=0.004, segments=4)
TOP = H + 0.0015

# readout window: dark glass set into the top of the chassis
finish(box("display_glass", 0.262, 0.07, 0.003, 0, 0.122, H - 0.001), M_GLASS, bevel=0.004, segments=4)

# six service keys in two rows of three
KW, KD, KH = 0.078, 0.07, 0.017
cols = (-0.087, 0.0, 0.087)
rows = (0.035, -0.045)
i = 0
for ry in rows:
    for cx in cols:
        k = box(f"key_{i}", KW, KD, KH, cx, ry, TOP, top_scale=0.88)
        dish(k, KW, KH)
        finish(k, M_KEY, bevel=0.0055, segments=6)
        i += 1

# the orange action key, wider, same profile
g = box("key_go", 0.168, 0.07, KH, 0.044, -0.128, TOP, top_scale=0.93)
dish(g, 0.168, KH, depth=0.001)
finish(g, M_GO, bevel=0.0055, segments=6)

# knob: machined cylinder with knurled ridges round the side and a chamfered top
bpy.ops.mesh.primitive_cylinder_add(vertices=120, radius=0.031, depth=0.024, location=(-0.087, -0.128, TOP + 0.012))
knob = bpy.context.active_object
knob.name = "knob"
bm = bmesh.new()
bm.from_mesh(knob.data)
for v in bm.verts:
    a = math.atan2(v.co.y, v.co.x)
    step = round(a / (2 * math.pi / 120))
    if step % 2 and abs(v.co.z) < 0.0119:
        f = (0.031 - 0.001) / 0.031
        v.co.x *= f
        v.co.y *= f
bm.to_mesh(knob.data)
bm.free()
# origin to the knob's base centre so it can spin in place
bpy.context.scene.cursor.location = (-0.087, -0.128, TOP)
bpy.ops.object.origin_set(type="ORIGIN_CURSOR")
finish(knob, M_KNOB, bevel=0.002, segments=3)
mark = box("knob_mark", 0.0028, 0.014, 0.0008, -0.087, -0.128 + 0.013, TOP + 0.024)
finish(mark, M_MARK, smooth=False)
mark.parent = knob
mark.matrix_parent_inverse = knob.matrix_world.inverted()

bpy.ops.object.select_all(action="DESELECT")
bpy.ops.export_scene.gltf(filepath=out, export_format="GLB", export_apply=True, export_yup=True, use_selection=False)
print("EXPORTED", out, [o.name for o in bpy.data.objects])
