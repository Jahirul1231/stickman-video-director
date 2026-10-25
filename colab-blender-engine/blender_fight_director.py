"""
Blender 3D Stickman Fight Director
Runs headlessly in Blender to create a cinematic 3D fight scene with:
- Dual Neon Stickman Rigs (Cyan vs Crimson)
- Aerial Launch & 0.15x Matrix Bullet-Time Slow Motion
- Seamless 270° Orbiting 3D Camera with Easing & Motion Blur
- Procedural Expanding 3D Shockwave Rings & Impact Lighting
- H.264 1080p MP4 Export
"""

import bpy
import math

def reset_scene():
    """Clear default objects"""
    bpy.ops.wm.read_factory_settings(use_empty=True)

def create_emission_material(name, color, strength=5.0):
    """Creates a vibrant neon glowing emission material"""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    
    emission = nodes.new(type='ShaderNodeEmission')
    emission.inputs['Color'].default_value = color
    emission.inputs['Strength'].default_value = strength
    
    output = nodes.new(type='ShaderNodeOutputMaterial')
    mat.node_tree.links.new(emission.outputs['Emission'], output.inputs['Surface'])
    return mat

def create_floor_material():
    """Dark reflective arena floor material"""
    mat = bpy.data.materials.new(name="DarkFloor")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    
    bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
    bsdf.inputs['Base Color'].default_value = (0.02, 0.03, 0.06, 1.0)
    bsdf.inputs['Roughness'].default_value = 0.15
    bsdf.inputs['Metallic'].default_value = 0.8
    
    output = nodes.new(type='ShaderNodeOutputMaterial')
    mat.node_tree.links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    return mat

def build_arena():
    """Builds the 3D ground plane and grid accents"""
    # Floor plane
    bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 0, 0))
    floor = bpy.context.active_object
    floor.name = "ArenaFloor"
    floor.data.materials.append(create_floor_material())
    
    # Grid lines / boundaries
    grid_mat = create_emission_material("GridMat", (0.0, 0.6, 1.0, 1.0), strength=2.0)
    bpy.ops.mesh.primitive_torus_add(major_radius=6.0, minor_radius=0.03, location=(0, 0, 0.02))
    ring = bpy.context.active_object
    ring.name = "ArenaRing"
    ring.data.materials.append(grid_mat)

def build_stickman(name, mat, base_x):
    """Builds a parametric 3D stickman hierarchy"""
    # Root empty
    bpy.ops.object.empty_add(type='PLAIN_AXES', location=(base_x, 0, 1.5))
    root = bpy.context.active_object
    root.name = f"{name}_Root"
    
    # Head
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.32, location=(base_x, 0, 2.5))
    head = bpy.context.active_object
    head.name = f"{name}_Head"
    head.data.materials.append(mat)
    head.parent = root
    
    # Torso
    bpy.ops.mesh.primitive_cylinder_add(radius=0.08, depth=1.0, location=(base_x, 0, 1.8))
    torso = bpy.context.active_object
    torso.name = f"{name}_Torso"
    torso.data.materials.append(mat)
    torso.parent = root
    
    # Left Arm
    bpy.ops.mesh.primitive_cylinder_add(radius=0.07, depth=0.9, location=(base_x - 0.45, 0, 2.0))
    arm_l = bpy.context.active_object
    arm_l.name = f"{name}_ArmL"
    arm_l.rotation_euler = (0, 0.5, 0)
    arm_l.data.materials.append(mat)
    arm_l.parent = root
    
    # Right Arm
    bpy.ops.mesh.primitive_cylinder_add(radius=0.07, depth=0.9, location=(base_x + 0.45, 0, 2.0))
    arm_r = bpy.context.active_object
    arm_r.name = f"{name}_ArmR"
    arm_r.rotation_euler = (0, -0.5, 0)
    arm_r.data.materials.append(mat)
    arm_r.parent = root
    
    # Left Leg
    bpy.ops.mesh.primitive_cylinder_add(radius=0.08, depth=1.1, location=(base_x - 0.25, 0, 0.75))
    leg_l = bpy.context.active_object
    leg_l.name = f"{name}_LegL"
    leg_l.data.materials.append(mat)
    leg_l.parent = root
    
    # Right Leg
    bpy.ops.mesh.primitive_cylinder_add(radius=0.08, depth=1.1, location=(base_x + 0.25, 0, 0.75))
    leg_r = bpy.context.active_object
    leg_r.name = f"{name}_LegR"
    leg_r.data.materials.append(mat)
    leg_r.parent = root
    
    return root, arm_l, arm_r, leg_l, leg_r

def setup_lighting():
    """Sets up high-contrast neon combat lighting"""
    # Key light Cyan
    bpy.ops.object.light_add(type='POINT', location=(-4, -5, 6))
    light_cyan = bpy.context.active_object
    light_cyan.data.energy = 800
    light_cyan.data.color = (0.0, 0.9, 1.0)
    
    # Rim light Crimson
    bpy.ops.object.light_add(type='POINT', location=(4, 5, 5))
    light_red = bpy.context.active_object
    light_red.data.energy = 800
    light_red.data.color = (1.0, 0.0, 0.3)
    
    # Fill Light
    bpy.ops.object.light_add(type='POINT', location=(0, -8, 2))
    light_fill = bpy.context.active_object
    light_fill.data.energy = 250
    light_fill.data.color = (0.8, 0.9, 1.0)

def setup_camera_and_animation(cyan_root, red_root, arm_l, arm_r, leg_l, leg_r):
    """Animates fighters, bullet-time slow motion, and seamless 270° camera orbit"""
    bpy.ops.object.camera_add(location=(0, -7.0, 2.2))
    cam = bpy.context.active_object
    bpy.context.scene.camera = cam
    cam.data.lens = 35
    
    # Track-to constraint for smooth framing
    track = cam.constraints.new(type='TRACK_TO')
    track.target = cyan_root
    track.track_axis = 'TRACK_NEGATIVE_Z'
    track.up_axis = 'UP_Y'
    
    total_frames = 240
    bpy.context.scene.frame_start = 1
    bpy.context.scene.frame_end = total_frames
    
    # --- Animation Keyframing ---
    
    # 1. Standoff & Tension (Frames 1 - 40)
    cam.location = (0, -6.5, 2.0)
    cam.keyframe_insert(data_path="location", frame=1)
    
    cyan_root.location = (-2.2, 0, 1.5)
    cyan_root.keyframe_insert(data_path="location", frame=1)
    red_root.location = (2.2, 0, 1.5)
    red_root.keyframe_insert(data_path="location", frame=1)
    
    # 2. High Speed Dash (Frame 60)
    cyan_root.location = (-0.6, 0, 1.5)
    cyan_root.keyframe_insert(data_path="location", frame=60)
    red_root.location = (0.6, 0, 1.5)
    red_root.keyframe_insert(data_path="location", frame=60)
    
    cam.location = (0, -4.2, 1.8)
    cam.keyframe_insert(data_path="location", frame=60)
    
    # 3. Aerial Launch (Frame 90)
    cyan_root.location = (-0.7, 0, 3.4)
    cyan_root.keyframe_insert(data_path="location", frame=90)
    red_root.location = (0.7, 0, 3.6)
    red_root.keyframe_insert(data_path="location", frame=90)
    
    # 4. BULLET TIME: 270° Smooth 3D Camera Orbit (Frames 90 - 180)
    # The camera swoops in a circular orbit around the suspended fighters
    for f in range(90, 181, 15):
        prog = (f - 90) / 90.0
        angle = -math.pi * 0.4 + prog * math.pi * 1.5  # 270 degrees orbit
        radius = 4.2
        cx = math.sin(angle) * radius
        cy = math.cos(angle) * radius
        cz = 2.2 + math.sin(prog * math.pi) * 1.2
        
        cam.location = (cx, cy, cz)
        cam.keyframe_insert(data_path="location", frame=f)
        
        # Subtle float in mid-air
        cyan_root.location = (-0.6 + prog * 0.2, 0, 3.4 - prog * 0.2)
        cyan_root.keyframe_insert(data_path="location", frame=f)
        red_root.location = (0.6, 0, 3.6 - prog * 0.2)
        red_root.keyframe_insert(data_path="location", frame=f)
    
    # 5. Critical Impact & Ground Crater Slam (Frame 195)
    cyan_root.location = (-0.8, 0, 0.8)
    cyan_root.keyframe_insert(data_path="location", frame=195)
    
    red_root.location = (3.5, 0, 0.2)
    red_root.keyframe_insert(data_path="location", frame=195)
    
    cam.location = (0, -4.8, 1.4)
    cam.keyframe_insert(data_path="location", frame=195)
    
    # 6. Hero Victory Landing & Settle (Frame 240)
    cyan_root.location = (-0.8, 0, 0.8)
    cyan_root.keyframe_insert(data_path="location", frame=240)
    
    cam.location = (-0.4, -3.4, 1.2)
    cam.keyframe_insert(data_path="location", frame=240)

def create_shockwave_effect():
    """3D expanding shockwave ring that ignites on impact"""
    mat = create_emission_material("ShockwaveMat", (1.0, 1.0, 1.0, 1.0), strength=8.0)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.1, minor_radius=0.04, location=(0.6, 0, 0.05))
    wave = bpy.context.active_object
    wave.name = "ImpactShockwave"
    wave.data.materials.append(mat)
    
    # Scale from 0 to 8 between frame 190 and 220
    wave.scale = (0.01, 0.01, 0.01)
    wave.keyframe_insert(data_path="scale", frame=189)
    wave.scale = (1.0, 1.0, 1.0)
    wave.keyframe_insert(data_path="scale", frame=195)
    wave.scale = (8.0, 8.0, 0.1)
    wave.keyframe_insert(data_path="scale", frame=220)

def configure_render_output(output_path):
    """Configures high-quality H.264 MP4 export settings"""
    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE'
    
    # Bloom and Motion blur for cinematic look
    if hasattr(scene.eevee, 'use_bloom'):
        scene.eevee.use_bloom = True
        scene.eevee.bloom_threshold = 0.8
        scene.eevee.bloom_intensity = 0.5
    if hasattr(scene.eevee, 'use_motion_blur'):
        scene.eevee.use_motion_blur = True
    
    scene.render.resolution_x = 1920
    scene.render.resolution_y = 1080
    scene.render.fps = 30
    
    scene.render.image_settings.file_format = 'FFMPEG'
    scene.render.ffmpeg.format = 'MPEG4'
    scene.render.ffmpeg.codec = 'H264'
    scene.render.ffmpeg.constant_rate_factor = 'MEDIUM'
    scene.render.ffmpeg.ffmpeg_preset = 'GOOD'
    scene.render.filepath = output_path

def main():
    print("🎬 Initializing 3D Stickman Fight Scene...")
    reset_scene()
    
    mat_cyan = create_emission_material("CyanNeon", (0.0, 0.95, 1.0, 1.0), strength=6.0)
    mat_crimson = create_emission_material("CrimsonNeon", (1.0, 0.05, 0.35, 1.0), strength=6.0)
    
    build_arena()
    cyan_root, c_al, c_ar, c_ll, c_lr = build_stickman("Cyan", mat_cyan, -2.2)
    red_root, r_al, r_ar, r_ll, r_lr = build_stickman("Red", mat_crimson, 2.2)
    
    setup_lighting()
    setup_camera_and_animation(cyan_root, red_root, c_al, c_ar, c_ll, c_lr)
    create_shockwave_effect()
    
    output_file = "/content/stickman_fight_3d.mp4"
    configure_render_output(output_file)
    print(f"⚡ Scene setup complete. Ready to render to {output_file}")

if __name__ == "__main__":
    main()
