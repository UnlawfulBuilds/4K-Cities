/* ===================================================================
   4K Cities — landmark models
   ------------------------------------------------------------------
   Hand-built to PUBLISHED REAL DIMENSIONS. Convention: 1 world unit = 2 m.
   So every real metre below is divided by 2 when placed.

   Sources for the dimensions used (real-world, then halved):
     Kaaba            12.0 x 10.5 x 13.1 m      ->  6.0 x 5.25 x 6.55 u
     Hijr Ismail      semicircle r ~ 8 m, h 1.3 m
     Maqam Ibrahim    small gilded edifice ~ 2 m
     Haram courtyard  ~ 200 m across (Mataf reading as open ground)
     Abraj Al-Bait    601 m total, clock face 43 m -> 300.5 u tall, 21.5 u dials
     Green Dome       d ~ 15 m, sits over the SE corner of the Prophet's Mosque
     Nabawi minarets  ~ 105 m -> 52 u
     Dome of the Rock dome d ~ 20.4 m, octagon ~ 55 m across, drum below
     Al-Aqsa          long hall, silver-grey dome, distinct from the Rock

   Deliberately NO figurative representation of any person or prophet.
   Exteriors, silhouette and proportions only.
   =================================================================== */

const LM = (function(){
  const U = 0.5;                 // real metres -> world units
  const S = m => m * U;

  /* Landmarks are hand-built from primitives, and hand-built things drift: a
     dome added on top quietly makes the whole thing 60% too tall, or a missing
     spire leaves it 40% short. fitH() measures the finished group and scales it
     uniformly so its top lands on the published height. Uniform scaling keeps
     whatever proportions the builder got right. `metres` is the real height;
     the measured box is in world units, so it is converted with U. */
  function fitH(g, metres){
    if (!g) return g;
    g.updateMatrixWorld(true);
    const bb = new THREE.Box3().setFromObject(g);
    if (!isFinite(bb.min.y)) return g;
    const cur = bb.max.y - bb.min.y;
    if (cur < 1e-3) return g;
    g.scale.multiplyScalar((metres * U) / cur);
    return g;
  }

  function mat(color, opts={}){
    return new THREE.MeshStandardMaterial(Object.assign({
      color: new THREE.Color(color), roughness: 0.85, metalness: 0.0
    }, opts));
  }
  function goldMat(){ return mat('#c9a227', {roughness:0.34, metalness:0.75}); }
  function addTo(group, geo, material, x, y, z, ry){
    const m = new THREE.Mesh(geo, material);
    m.position.set(x, y, z);
    if (ry) m.rotation.y = ry;
    m.castShadow = true; m.receiveShadow = true;
    group.add(m);
    return m;
  }

  /* ---------------------------------------------------------------- Kaaba
     The single most recognisable object in the set. Must be right:
       - 12.0 x 10.5 m base, 13.1 m tall, black kiswah
       - gold hizam band at the UPPER THIRD (not the middle)
       - gold door on the north-east face, raised ~2 m
       - Black Stone in the eastern corner
       - Hijr Ismail semicircular wall on the north-west side
  */
  function kaaba(x, z, parent){
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    const W = S(12.0), D = S(10.5), H = S(13.1);

    // body — black kiswah
    const kiswah = mat('#0d0d0f', {roughness:0.94});
    addTo(g, new THREE.BoxGeometry(W, H, D), kiswah, 0, H/2, 0);

    // gold hizam band, upper third (real band sits ~ 3/4 up the wall)
    const bandY = H * 0.74, bandH = S(0.95);
    const belt = mat('#b8912e', {roughness:0.42, metalness:0.62});
    const t = 0.06;
    addTo(g, new THREE.BoxGeometry(W + t, bandH, t), belt, 0, bandY,  D/2 + t/2);
    addTo(g, new THREE.BoxGeometry(W + t, bandH, t), belt, 0, bandY, -D/2 - t/2);
    addTo(g, new THREE.BoxGeometry(t, bandH, D + t), belt,  W/2 + t/2, bandY, 0);
    addTo(g, new THREE.BoxGeometry(t, bandH, D + t), belt, -W/2 - t/2, bandY, 0);

    // gold door, north-east face, raised ~2 m
    const door = mat('#c8a13a', {roughness:0.3, metalness:0.8});
    addTo(g, new THREE.BoxGeometry(S(2.0), S(3.6), S(0.18)), door,
          0, S(2.0) + S(1.8), -D/2 - S(0.09));
    // door frame / gold surround
    addTo(g, new THREE.BoxGeometry(S(2.6), S(4.2), S(0.1)),
          mat('#a8822a', {roughness:0.4, metalness:0.7}),
          0, S(2.0) + S(1.9), -D/2 - S(0.05));

    // Black Stone corner marker — east corner, silver frame
    const bstone = mat('#1b1b1e', {roughness:0.5});
    addTo(g, new THREE.SphereGeometry(S(0.16), 12, 10), bstone, W/2 - S(0.15), S(1.55), 0);

    // roof cornice
    addTo(g, new THREE.BoxGeometry(W + S(0.4), S(0.35), D + S(0.4)),
          mat('#121214'), 0, H + S(0.17), 0);

    // Hijr Ismail — semicircular wall on the north-west side, 1.3 m high
    const hijrR = S(8.0), hijrH = S(1.3);
    const wallGeo = new THREE.CylinderGeometry(hijrR, hijrR, hijrH, 40, 1, true, Math.PI, Math.PI);
    const hijr = new THREE.Mesh(wallGeo, mat('#cfc9bb', {roughness:0.9}));
    hijr.position.set(-W/2 - S(2.6), hijrH/2, 0);
    hijr.rotation.y = Math.PI/2;
    hijr.castShadow = true; hijr.receiveShadow = true;
    g.add(hijr);

    // Maqam Ibrahim — small gilded edifice opposite the door
    const maqam = new THREE.Group();
    maqam.position.set(S(4.2), 0, -S(9.0));
    const domeG = new THREE.SphereGeometry(S(1.5), 20, 12, 0, Math.PI*2, 0, Math.PI/2);
    addTo(maqam, new THREE.CylinderGeometry(S(1.5), S(1.6), S(2.2), 16), goldMat(), 0, S(1.1), 0);
    addTo(maqam, domeG, goldMat(), 0, S(2.2), 0);
    g.add(maqam);

    parent.add(g);
    return g;
  }

  /* ------------------------------------------------------- Masjid al-Haram
     The courtyard must read as OPEN GROUND: the tawaf floor is empty.
     Only the perimeter arcade and minarets are built, so the Mataf is clear. */
  function haram(x, z, parent){
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    const R = S(96);                       // courtyard radius ~ 96 m real
    const matStone = mat('#e2d8c4', {roughness:0.88});
    const matRoof  = mat('#7c6f58', {roughness:0.9});

    // mataf floor — very pale marble, slightly raised
    const floor = new THREE.Mesh(new THREE.CircleGeometry(R, 72), mat('#efe9dc', {roughness:0.6}));
    floor.rotation.x = -Math.PI/2; floor.position.y = 0.08;
    floor.receiveShadow = true;
    g.add(floor);

    // perimeter arcade rings (galleries), leaving the centre open
    const ringGeo = new THREE.TorusGeometry(R + S(8), S(4.5), 8, 72);
    [0.0].forEach(()=>{
      const ring = new THREE.Mesh(ringGeo, matStone);
      ring.rotation.x = Math.PI/2; ring.position.y = S(9);
      ring.castShadow = true; ring.receiveShadow = true;
      g.add(ring);
    });
    // galleria wall band below the ring
    const wall = new THREE.Mesh(
      new THREE.CylinderGeometry(R + S(11), R + S(11), S(14), 72, 1, true),
      matStone);
    wall.position.y = S(7); wall.material.side = THREE.DoubleSide;
    wall.castShadow = true; wall.receiveShadow = true;
    g.add(wall);
    // roof ring
    const roof = new THREE.Mesh(new THREE.TorusGeometry(R + S(11), S(5.5), 6, 72), matRoof);
    roof.rotation.x = Math.PI/2; roof.position.y = S(15);
    roof.castShadow = true; g.add(roof);

    // minarets around the perimeter
    const nMin = 10;
    for (let i=0;i<nMin;i++){
      const a = (i/nMin)*Math.PI*2 + 0.3;
      const mx = Math.cos(a)*(R + S(16)), mz = Math.sin(a)*(R + S(16));
      const h = S(89);                   // ~89 m real minarets
      addTo(g, new THREE.CylinderGeometry(S(2.4), S(3.0), h, 12), matStone, mx, h/2, mz);
      addTo(g, new THREE.CylinderGeometry(S(3.2), S(3.2), S(2.0), 12),
            mat('#cbbfa6'), mx, h*0.66, mz);
      const cap = new THREE.ConeGeometry(S(3.0), S(11), 12);
      addTo(g, cap, mat('#5f6b5a', {roughness:0.6}), mx, h + S(5.5), mz);
      addTo(g, new THREE.SphereGeometry(S(0.7), 8, 6), goldMat(), mx, h + S(12), mz);
    }
    parent.add(g);
    return g;
  }

  /* ------------------------------------------------ Abraj Al-Bait clock tower
     ~601 m total (300.5 u), clock faces ~43 m (21.5 u). The dominant vertical. */
  function clockTower(x, z, parent){
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    const baseH = S(180), towerW = S(46), towerD = S(46);
    addTo(g, new THREE.BoxGeometry(towerW*1.9, baseH, towerD*1.9),
          mat('#c6b596', {roughness:0.9}), 0, baseH/2, 0);
    const shaftH = S(230);
    addTo(g, new THREE.BoxGeometry(towerW, shaftH, towerD),
          mat('#d3c3a4', {roughness:0.85}), 0, baseH + shaftH/2, 0);
    // clock housing
    const clkY = baseH + shaftH + S(30);
    addTo(g, new THREE.BoxGeometry(towerW*1.25, S(60), towerD*1.25),
          mat('#e0d2b6', {roughness:0.8}), 0, clkY, 0);
    // four dials
    const dialR = S(21.5), face = mat('#f4efe2', {roughness:0.5, emissive:new THREE.Color('#3a3320'), emissiveIntensity:0.25});
    const frame = mat('#b9992f', {roughness:0.35, metalness:0.7});
    [[0,0,1],[0,0,-1],[1,0,0],[-1,0,0]].forEach(d=>{
      const n = new THREE.Vector3(d[0],0,d[2]);
      const fx = n.x*(towerW*0.63), fz = n.z*(towerD*0.63);
      const dial = new THREE.Mesh(new THREE.CircleGeometry(dialR, 40), face);
      dial.position.set(fx, clkY, fz);
      dial.lookAt(n.clone().multiplyScalar(10));
      g.add(dial);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(dialR, S(1.1), 6, 40), frame);
      ring.position.set(fx, clkY, fz); ring.lookAt(n.clone().multiplyScalar(10));
      g.add(ring);
    });
    // crescent spire
    const spireH = S(95);
    addTo(g, new THREE.ConeGeometry(towerW*0.42, spireH, 8),
          mat('#cbb98f', {roughness:0.7}), 0, clkY + S(30) + spireH/2, 0);
    addTo(g, new THREE.SphereGeometry(S(6), 12, 10), goldMat(), 0, clkY + S(30) + spireH + S(4), 0);
    parent.add(g);
    return g;
  }

  /* ------------------------------------------------- Nabawi mosque + Green Dome
     The Green Dome sits over the SOUTH-EAST corner of the mosque — getting
     its position wrong is the single most common error in models of Madinah. */
  function nabawi(x, z, parent){
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    const bodyW = S(128), bodyD = S(100), bodyH = S(22);
    const matWall = mat('#e6dcc6', {roughness:0.88});
    const matRoof = mat('#8a7c62', {roughness:0.92});

    // main hall
    addTo(g, new THREE.BoxGeometry(bodyW, bodyH, bodyD), matWall, 0, bodyH/2, 0);
    addTo(g, new THREE.BoxGeometry(bodyW+S(2), S(1.6), bodyD+S(2)), matRoof, 0, bodyH+S(0.8), 0);

    // Green Dome — SE corner. Colour must read green.
    const gd = S(7.5);                 // dome radius ~ 7.5 m real
    const domeY = bodyH + S(9);
    const greenDome = mat('#1f6b46', {roughness:0.62, metalness:0.05});
    addTo(g, new THREE.CylinderGeometry(gd*0.98, gd*0.98, S(6), 24), matWall,
          bodyW*0.28, bodyH + S(3), bodyD*0.30);
    addTo(g, new THREE.SphereGeometry(gd, 28, 18, 0, Math.PI*2, 0, Math.PI/2),
          greenDome, bodyW*0.28, domeY, bodyD*0.30);
    addTo(g, new THREE.SphereGeometry(S(0.6), 8, 6), goldMat(),
          bodyW*0.28, domeY + gd + S(0.6), bodyD*0.30);

    // secondary domes along the hall
    for (let i=-2;i<=2;i++){
      if (i===0) continue;
      addTo(g, new THREE.SphereGeometry(S(5.2), 20, 12, 0, Math.PI*2, 0, Math.PI/2),
            mat('#d8cfae', {roughness:0.7}), i*S(24), bodyH + S(1), 0);
    }

    // minarets ~105 m
    const minSpecs = [[-1,-1],[1,-1],[-1,1],[1,1],[0,1.35]];
    minSpecs.forEach(([a,b])=>{
      const mx = a*bodyW*0.62, mz = b*bodyD*0.62, h = S(105);
      addTo(g, new THREE.CylinderGeometry(S(3.0), S(3.6), h, 14), matWall, mx, h/2, mz);
      addTo(g, new THREE.CylinderGeometry(S(4.0), S(4.0), S(2.4), 14), mat('#d3c8ae'), mx, h*0.62, mz);
      addTo(g, new THREE.ConeGeometry(S(3.4), S(13), 14), mat('#5f6b5a'), mx, h + S(6.5), mz);
      addTo(g, new THREE.SphereGeometry(S(0.8), 8, 6), goldMat(), mx, h + S(13.5), mz);
    });

    // the sliding umbrellas — signature of the courtyard
    const uMat = mat('#efeadb', {roughness:0.75});
    const uRib = mat('#cfc6ae', {roughness:0.8});
    const cols = 7, rows = 5;
    for (let i=0;i<cols;i++){
      for (let j=0;j<rows;j++){
        const ux = (i - (cols-1)/2) * S(28);
        const uz = (j - (rows-1)/2) * S(28) + bodyD*0.95;
        const h = S(9);
        addTo(g, new THREE.CylinderGeometry(S(0.3), S(0.3), h, 6), uRib, ux, h/2, uz);
        // opened canopy: shallow cone
        const canopy = addTo(g, new THREE.ConeGeometry(S(9), S(2.6), 10), uMat, ux, h + S(1.2), uz);
        canopy.castShadow = true;
      }
    }
    parent.add(g);
    return g;
  }

  /* ----------------------------------------- Dome of the Rock (Qubbat al-Sakhra)
     Octagonal base, drum, gold dome d ~ 20.4 m. Must not be confused with Al-Aqsa. */
  function domeOfTheRock(x, z, parent){
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    const octR = S(27.5);              // octagon ~55 m across
    const baseH = S(11);
    const matWall = mat('#e8e0cb', {roughness:0.86});
    // stepped octagonal platform
    addTo(g, new THREE.CylinderGeometry(octR*1.35, octR*1.42, S(3), 8), mat('#ddd3ba'), 0, S(1.5), 0);
    addTo(g, new THREE.CylinderGeometry(octR, octR, baseH, 8), matWall, 0, S(3) + baseH/2, 0);
    // drum
    const drumR = S(11.6), drumH = S(9);
    addTo(g, new THREE.CylinderGeometry(drumR, drumR, drumH, 24),
          mat('#efe8d6', {roughness:0.8}), 0, S(3) + baseH + drumH/2, 0);
    // gold dome
    const domeR = S(10.2);
    addTo(g, new THREE.SphereGeometry(domeR, 30, 18, 0, Math.PI*2, 0, Math.PI/2),
          goldMat(), 0, S(3) + baseH + drumH, 0);
    // finial
    addTo(g, new THREE.CylinderGeometry(S(0.2), S(0.2), S(4), 6), goldMat(),
          0, S(3) + baseH + drumH + domeR + S(2), 0);
    parent.add(g);
    return g;
  }

  /* ------------------------------------------------------ Al-Aqsa Mosque
     Long hall with a silver-grey dome — deliberately distinct in silhouette
     and colour from the Dome of the Rock. */
  function alAqsa(x, z, parent){
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    const w = S(80), d = S(55), h = S(18);
    const matWall = mat('#ddd5c0', {roughness:0.88});
    addTo(g, new THREE.BoxGeometry(w, h, d), matWall, 0, h/2, 0);
    addTo(g, new THREE.BoxGeometry(w + S(2), S(1.4), d + S(2)),
          mat('#8b8270', {roughness:0.9}), 0, h + S(0.7), 0);
    // silver-grey dome on the south end
    addTo(g, new THREE.SphereGeometry(S(8.0), 26, 16, 0, Math.PI*2, 0, Math.PI/2),
          mat('#9aa3a8', {roughness:0.45, metalness:0.35}), w*0.28, h + S(1), 0);
    addTo(g, new THREE.CylinderGeometry(S(8.0), S(8.0), S(3), 24),
          matWall, w*0.28, h + S(1.5), 0);
    parent.add(g);
    return g;
  }

  /* --------------------------------------------------------------- dispatcher */
  function build(scene, city, plots){
    const by = {};
    (plots||[]).forEach(p=>{ by[p.name] = p; });
    const find = frag => (plots||[]).find(p => p.name.toLowerCase().includes(frag));
    const root = new THREE.Group(); root.name = 'landmarks';
    const made = [];

    if (city === 'makkah'){
      const h = find('haram');
      if (h){ const hg = haram(h.x, h.z, root);
              /* the arcade + minarets reach 137 m; the Kaaba is 13.1 m and is
                 built separately so it keeps its own true height */
              if (hg) fitH(hg, 137);
              made.push('Masjid al-Haram arcade + minarets');
              kaaba(h.x, h.z, root); made.push('the Kaaba (kiswah, hizam, door, Hijr Ismail)'); }
      const c = find('abraj') || find('clock');
      if (c){ clockTower(c.x, c.z, root); made.push('Abraj Al-Bait clock tower'); }
    }
    if (city === 'madinah'){
      const m = find('nabawi');
      if (m){ const mg = nabawi(m.x, m.z, root);
              if (mg) fitH(mg, 104);      // the minarets; the Green Dome stays ~26 m
              made.push('Al-Masjid an-Nabawi, Green Dome, umbrellas'); }
    }
    if (city === 'quds'){
      const h = find('haram') || find('dome of the rock');
      if (h){ const dg = domeOfTheRock(h.x, h.z, root);
              if (dg) fitH(dg, 35);       // the Rock rises ~35 m above the plaza
              made.push('Dome of the Rock');
              const ag = alAqsa(h.x + S(120), h.z + S(60), root);
              if (ag) fitH(ag, 37);
              made.push('Al-Aqsa Mosque'); }
    }
    scene.add(root);
    return {group: root, made};
  }

  return {build, kaaba, haram, clockTower, nabawi, domeOfTheRock, alAqsa, fitH};
})();

/* ===================================================================
   Additional city landmarks — hand-built to published dimensions.
   Same 1 unit = 2 m convention.
   =================================================================== */
(function(){
  const U=0.5, S=m=>m*U;
  function M(c,o){ return new THREE.MeshStandardMaterial(Object.assign({color:new THREE.Color(c),roughness:0.85,metalness:0},o||{})); }
  const GOLD=()=>M('#c9a227',{roughness:0.33,metalness:0.78});
  function box(g,w,h,d,c,x,y,z,mat,ry){ const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat||M(c)); m.position.set(x,y,z); if(ry)m.rotation.y=ry; m.castShadow=m.receiveShadow=true; g.add(m); return m; }
  function cyl(g,rt,rb,h,seg,c,x,y,z,mat){ const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),mat||M(c)); m.position.set(x,y,z); m.castShadow=m.receiveShadow=true; g.add(m); return m; }
  function dome(g,r,c,x,y,z,mat){ const m=new THREE.Mesh(new THREE.SphereGeometry(r,26,16,0,Math.PI*2,0,Math.PI/2),mat||M(c)); m.position.set(x,y,z); m.castShadow=true; g.add(m); return m; }
  function cone(g,r,h,seg,c,x,y,z,mat){ const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,seg),mat||M(c)); m.position.set(x,y,z); m.castShadow=true; g.add(m); return m; }


  const fitH2 = LM.fitH;      // shared with the second IIFE's builders
  const EXTRA = {

  /* ---------------- Paris ---------------- */
  paris(plots, root){
    const h=(plots||[])||[];
    /* THE plot, not the origin. This builder used to drop the tower at (0,0,0),
       which put a 176-unit orange spire over the middle of the city instead of
       on the Champ de Mars. */
    const plot = (h.find(p=>p.name.includes('Eiffel')) || h[0] || {x:0,z:0});
    const g=new THREE.Group(); g.position.set(plot.x,0,plot.z);
    const e=new THREE.Group();           // the tower itself, built below
    // Eiffel Tower - 330 m -> 165 u, four splayed iron legs meeting in a shaft
    const iron = M('#7a6e5e', {roughness:0.7, metalness:0.38});
    /* Four continuous legs. Each leg runs from a corner at the base to the
       corresponding corner at the second platform, then up the shaft. The
       orientation is solved from the two stations, so the segments actually
       meet: an earlier version tilted a cylinder by an approximate angle and
       left visible gaps between the stations. */
    const LEG = [[0,       S(62),  S(9.5)],       // [y, half-spread, leg radius]
                 [S(57),   S(34),  S(6.0)],
                 [S(115),  S(17),  S(3.4)],
                 [S(165),  S(9),   S(2.0)]];
    const UP = new THREE.Vector3(0,1,0);
    for (const sx of [-1,1]) for (const sz of [-1,1]){
      for (let i=0;i<LEG.length-1;i++){
        const [y0, sp0, r0] = LEG[i];
        const [y1, sp1, r1] = LEG[i+1];
        const A = new THREE.Vector3(sx*sp0, y0, sz*sp0);
        const B = new THREE.Vector3(sx*sp1, y1, sz*sp1);
        const dir = new THREE.Vector3().subVectors(B, A);
        const len = dir.length();
        const legGeo = new THREE.CylinderGeometry(r1, r0, len, 4);
        const leg = new THREE.Mesh(legGeo, iron);
        leg.position.copy(A).addScaledVector(dir, 0.5);
        leg.quaternion.setFromUnitVectors(UP, dir.clone().normalize());
        leg.castShadow = true; e.add(leg);
      }
    }
    /* the three platforms, sized to the spread of the legs at their height */
    for (const [y, sp] of [[S(57), S(34)], [S(115), S(17)], [S(165), S(10)]]){
      box(e, sp*2.05, S(1.5), sp*2.05, null, 0, y, 0, iron);
      // a thin balustrade band so the platform does not read as a plain slab
      box(e, sp*2.12, S(0.5), sp*2.12, null, 0, y + S(1.1), 0,
          M('#8d8070', {roughness:0.8}));
    }
    /* LATTICE: horizontal rings plus corner ties between the stations. This is
       what makes it read as the Eiffel Tower rather than four posts. */
    const lat = M('#6e6252', {roughness:0.75, metalness:0.3});
    for (let i=0;i<LEG.length-1;i++){
      const [y0, sp0] = LEG[i], [y1, sp1] = LEG[i+1];
      for (let k=1;k<=4;k++){
        const t = k/5, y = y0 + (y1-y0)*t, sp = sp0 + (sp1-sp0)*t;
        for (const [ax,az,bx,bz] of [[-1,-1,1,-1],[1,-1,1,1],[1,1,-1,1],[-1,1,-1,-1]]){
          const X = new THREE.Vector3(ax*sp, y, az*sp);
          const Y = new THREE.Vector3(bx*sp, y, bz*sp);
          const d2 = new THREE.Vector3().subVectors(Y, X);
          const bar = new THREE.Mesh(new THREE.BoxGeometry(S(0.35), S(0.35), d2.length()), lat);
          bar.position.copy(X).addScaledVector(d2, 0.5);
          bar.lookAt(Y); bar.castShadow = true; e.add(bar);
        }
      }
      // the diagonals of the X-bracing on each face
      for (const [ax,az,bx,bz] of [[-1,-1,1,-1],[1,-1,1,1],[1,1,-1,1],[-1,1,-1,-1]]){
        const X = new THREE.Vector3(ax*sp0, y0, az*sp0);
        const Y = new THREE.Vector3(bx*sp1, y1, bz*sp1);
        const d2 = new THREE.Vector3().subVectors(Y, X);
        const bar = new THREE.Mesh(new THREE.BoxGeometry(S(0.3), S(0.3), d2.length()), lat);
        bar.position.copy(X).addScaledVector(d2, 0.5);
        bar.lookAt(Y); bar.castShadow = true; e.add(bar);
      }
    }
    // upper shaft and the top
    cyl(e, S(1.6), S(2.6), S(48), 4, null, 0, S(140), 0, iron);
    cyl(e, S(0.9), S(1.7), S(44), 4, null, 0, S(186), 0, iron);
    cone(e, S(0.6), S(20), 6, null, 0, S(176), 0, iron);     // antenna
    fitH2(e, 330);          // 330 m to the antenna tip, the published figure
    g.add(e);
    root.add(g);
    const made = ['Eiffel Tower'];

    /* ---- the rest of Paris, each on its own plot ---- */
    const plotOf = (needle) => h.find(p => p.name.toLowerCase().includes(needle));

    /* Louvre: the long Denon/Richelieu wings round the Cour Napoléon, with the
       21.6 m glass pyramid (35.4 m per side) in the middle of the courtyard. */
    const lv = plotOf('louvre');
    if (lv){
      const g2 = new THREE.Group(); g2.position.set(lv.x, 0, lv.z);
      const stone = M('#d9d0bd'), slate = M('#4a4f57', {roughness:0.55});
      box(g2, S(160), S(16), S(22), slate, 0, S(8), S(-58), stone);   // Richelieu wing
      box(g2, S(160), S(16), S(22), slate, 0, S(8), S( 58), stone);   // Denon wing
      box(g2, S(22), S(16), S(140), slate, S(-72), S(8), 0, stone);   // west wing
      box(g2, S(22), S(16), S(140), slate, S( 72), S(8), 0, stone);   // east wing
      // pavilion roofs
      [['-72',0],['72',0]].forEach(([px,pz])=>{});
      for (const [px,pz] of [[-72,0],[72,0],[0,-58],[0,58]])
        box(g2, S(28), S(5), S(28), '#3f444c', S(px), S(18), S(pz), slate);
      // I. M. Pei pyramid: 35.4 m square, 21.6 m tall
      const pyr = new THREE.Mesh(new THREE.ConeGeometry(S(25.0), S(21.6), 4),
                                 new THREE.MeshStandardMaterial({color:new THREE.Color('#9fb2c0'),
                                   roughness:0.12, metalness:0.35, transparent:true, opacity:0.62}));
      pyr.position.set(0, S(21.6)/2, 0); pyr.rotation.y = Math.PI/4;
      pyr.castShadow = true; g2.add(pyr);
      root.add(g2); made.push('Louvre + Pyramid');
    }

    /* Notre-Dame: 128 m long, 48 m wide, 33 m vault, twin 69 m towers, 96 m spire */
    const nd = plotOf('notre');
    if (nd){
      const g3 = new THREE.Group(); g3.position.set(nd.x, 0, nd.z);
      const stone = M('#cfc7b4');
      box(g3, S(48), S(33), S(128), '#8d8f92', 0, S(16.5), 0, stone);   // nave
      box(g3, S(48), S(13), S(120), '#4c5158', 0, S(33)+S(6.5), 0, null);  // lead roof
      // twin west towers, 69 m
      box(g3, S(20), S(69), S(20), '#4c5158', S(-14), S(34.5), S(-58), stone);
      box(g3, S(20), S(69), S(20), '#4c5158', S( 14), S(34.5), S(-58), stone);
      // flèche over the crossing
      cone(g3, S(6), S(30), 8, '#4c5158', 0, S(33)+S(13)+S(15), S(6), null);
      // transept
      box(g3, S(60), S(30), S(20), '#8d8f92', 0, S(15), S(6), stone);
      fitH2(g3, 96); root.add(g3); made.push('Notre-Dame');
    }

    /* Arc de Triomphe: 50 m tall, 45 m wide, 22 m deep, 29.19 m arch */
    const arc = plotOf('arc de');
    if (arc){
      const g4 = new THREE.Group(); g4.position.set(arc.x, 0, arc.z);
      const stone = M('#ddd5c2');
      box(g4, S(45), S(50), S(22), null, 0, S(25), 0, stone);
      // hollow the arch by putting the void in front of the face
      const void1 = new THREE.Mesh(new THREE.BoxGeometry(S(14.6), S(29.19), S(24)),
        new THREE.MeshBasicMaterial({color:new THREE.Color('#0e1014')}));
      void1.position.set(0, S(29.19)/2, 0); g4.add(void1);
      // attic and cornice bands
      box(g4, S(47), S(2.2), S(24), '#e8e1cf', 0, S(48), 0, stone);
      box(g4, S(45.6), S(1.4), S(22.6), '#cdc5b2', 0, S(42), 0, stone);
      root.add(g4); made.push('Arc de Triomphe');
    }

    /* Sacré-Cœur: 83 m to the dome apex, four domes plus the great one */
    const sc = plotOf('sacre');
    if (sc){
      const g5 = new THREE.Group(); g5.position.set(sc.x, 0, sc.z);
      const white = M('#efe9dc');
      box(g5, S(50), S(26), S(50), null, 0, S(13), 0, white);
      dome(g5, S(16), '#f4efe4', 0, S(26), 0, white);              // main dome
      cyl(g5, S(12.5), S(12.5), S(11), 24, null, 0, S(31), 0, white); // drum
      for (const [dx,dz,r] of [[-13,-13,7],[13,-13,7],[-13,13,7],[13,13,7]])
        dome(g5, S(r), '#f4efe4', S(dx), S(26), S(dz), white);
      // campanile
      box(g5, S(9), S(38), S(9), null, S(-26), S(19), S(-26), white);
      dome(g5, S(4.5), '#f4efe4', S(-26), S(38), S(-26), white);
      fitH2(g5, 83); root.add(g5); made.push('Sacré-Coeur');
    }

    /* Opéra Garnier: 172 m long, 124 m wide, 79 m to the apex */
    const op = plotOf('opera');
    if (op){
      const g6 = new THREE.Group(); g6.position.set(op.x, 0, op.z);
      const stone = M('#dcd2bc');
      box(g6, S(124), S(24), S(112), null, 0, S(12), 0, stone);
      box(g6, S(110), S(10), S(98), '#4d5259', 0, S(29), 0, null);
      dome(g6, S(17), '#7e8f7a', 0, S(34), 0, M('#7e8f7a', {metalness:0.5, roughness:0.4}));
      cyl(g6, S(13), S(13), S(9), 24, null, 0, S(34), 0, stone);
      // the gilded roof groups either side
      for (const dz of [-1,1])
        dome(g6, S(8), '#b8963f', S(-30)*dz, S(32), 0,
             M('#b8963f', {metalness:0.7, roughness:0.35}));
      fitH2(g6, 79); root.add(g6); made.push('Opéra Garnier');
    }

    /* Les Invalides: 107 m gilded dome — the highest point in Paris until 1889 */
    const iv = plotOf('invalides');
    if (iv){
      const g7 = new THREE.Group(); g7.position.set(iv.x, 0, iv.z);
      const stone = M('#dcd3bf');
      box(g7, S(110), S(20), S(110), null, 0, S(10), 0, stone);
      box(g7, S(48), S(20), S(48), null, 0, S(30), 0, stone);       // drum block
      cyl(g7, S(17), S(17.5), S(22), 32, null, 0, S(51), 0, stone); // drum
      const gold = M('#d8b64a', {metalness:0.85, roughness:0.28});
      dome(g7, S(17.2), '#d8b64a', 0, S(62), 0, gold);
      cone(g7, S(2.2), S(14), 8, '#d8b64a', 0, S(86), 0, gold);     // lantern spire
      fitH2(g7, 107); root.add(g7); made.push('Les Invalides');
    }

    return made.join(' · ');
  },

  /* ---------------- Istanbul ---------------- */
  istanbul(plots, root){
    const made=[];
    const hg = plots.find(p=>p.name.includes('Hagia'));
    if(hg){ const g=new THREE.Group(); g.position.set(hg.x,0,hg.z);
      const stone=M('#d8cdb6');
      box(g,S(82),S(24),S(72),null,0,S(12),0,stone);
      dome(g,S(15),null,0,S(24),0,M('#8a9088',{roughness:0.6,metalness:0.2}));
      cyl(g,S(15),S(15),S(7),24,null,0,S(27),0,stone);
      [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{
        cyl(g,S(2.6),S(3.4),S(55),12,null,a*S(38),S(27),b*S(33),stone);
        cone(g,S(3),S(9),12,null,a*S(38),S(84),b*S(33),M('#6b7368'));
      });
      fitH2(g, 55); root.add(g); made.push('Hagia Sophia'); }
    const bm = plots.find(p=>p.name.includes('Blue'));
    if(bm){ const g=new THREE.Group(); g.position.set(bm.x,0,bm.z);
      const stone=M('#cfd2cc');
      box(g,S(64),S(20),S(64),null,0,S(10),0,stone);
      dome(g,S(12),null,0,S(20),0,M('#5f7d86',{roughness:0.5}));
      for(let i=0;i<6;i++){ const a=(i/6)*Math.PI*2;
        cyl(g,S(1.9),S(2.4),S(52),10,null,Math.cos(a)*S(36),S(26),Math.sin(a)*S(36),stone);
        cone(g,S(2.2),S(8),10,null,Math.cos(a)*S(36),S(80),Math.sin(a)*S(36),M('#5f7d86'));}
      fitH2(g, 43); root.add(g); made.push('Blue Mosque'); }
    const gt = plots.find(p=>p.name.includes('Galata'));
    if(gt){ const g=new THREE.Group(); g.position.set(gt.x,0,gt.z);
      cyl(g,S(7),S(9),S(33),16,null,0,S(16.5),0,M('#b9a98f'));
      cone(g,S(8),S(14),16,null,0,S(40),0,M('#6b6a63'));
      fitH2(g, 67); root.add(g); made.push('Galata Tower'); }
    return made.join(' · ');
  },

  /* ---------------- Venice ---------------- */
  venice(plots, root){
    const made=[];
    const sm = plots.find(p=>p.name.includes('San Marco'));
    if(sm){ const g=new THREE.Group(); g.position.set(sm.x,0,sm.z);
      const stone=M('#e0d5bc');
      box(g,S(60),S(20),S(48),null,0,S(10),0,stone);
      for(let i=-2;i<=2;i++) dome(g,S(7),null,i*S(12),S(20),0,M('#cbbfa6'));
      const cp = plots.find(p=>p.name.includes('Campanile'));
      if(cp){ const cg=new THREE.Group(); cg.position.set(cp.x-sm.x,0,cp.z-sm.z);
        box(cg,S(12),S(49),S(12),null,0,S(24.5),0,M('#c4b49a'));   // 98.6 m -> 49 u
        cone(cg,S(8),S(16),4,null,0,S(57),0,M('#6f7a6a')); cg.position.x+=0; g.add(cg); }
      const dp = plots.find(p=>p.name.includes('Doge'));
      if(dp){ const dg=new THREE.Group(); dg.position.set(dp.x-sm.x,0,dp.z-sm.z);
        box(dg,S(80),S(18),S(60),null,0,S(9),0,M('#e8dcc0')); g.add(dg); }
      // the group holds San Marco (43.3 m), the 98.6 m campanile and the palace
      fitH2(g, 98.6); root.add(g); made.push('San Marco, campanile, Doge\'s Palace'); }
    return made.join(' · ')||'San Marco';
  },

  /* ---------------- Prague ---------------- */
  prague(plots, root){
    const made=[];
    const pc = plots.find(p=>p.name.includes('Castle'));
    if(pc){ const g=new THREE.Group(); g.position.set(pc.x,0,pc.z);
      box(g,S(200),S(26),S(140),null,0,S(13),0,M('#cfc3a8'));
      const sv=new THREE.Group(); sv.position.set(0,0,S(40));
      box(sv,S(40),S(40),S(30),null,0,S(20),0,M('#d8ccb0'));
      cone(sv,S(10),S(44),4,null,0,S(62),0,M('#5f6b63'));   // St Vitus spire
      g.add(sv); fitH2(g, 96); root.add(g); made.push('Prague Castle + St Vitus'); }
    return made.join(' · ')||'Prague Castle';
  },

  /* ---------------- Kyoto ---------------- */
  kyoto(plots, root){
    const made=[];
    const tj = plots.find(p=>p.name.includes('To-ji'));
    if(tj){ const g=new THREE.Group(); g.position.set(tj.x,0,tj.z);
      for(let i=0;i<5;i++){ const w=S(18)-i*S(2.4);
        box(g,w,S(7),w,null,0,S(3.5)+i*S(9),0,M('#8a5a3c'));
        box(g,w*1.5,S(0.8),w*1.5,null,0,S(7)+i*S(9),0,M('#5c4a3a')); }
      cone(g,S(1),S(14),6,null,0,S(48),0,M('#6b5a44'));
      fitH2(g, 55); root.add(g); made.push('To-ji pagoda'); }
    const kk = plots.find(p=>p.name.includes('Kinkaku'));
    if(kk){ const g=new THREE.Group(); g.position.set(kk.x,0,kk.z);
      box(g,S(26),S(9),S(20),null,0,S(4.5),0,M('#d8b64a',{roughness:0.35,metalness:0.5}));
      box(g,S(20),S(6),S(16),null,0,S(12),0,M('#7a4a30'));
      root.add(g); made.push('Kinkaku-ji'); }
    const fi = plots.find(p=>p.name.includes('Fushimi'));
    if(fi){ const g=new THREE.Group(); g.position.set(fi.x,0,fi.z);
      /* senbon torii: ~4 m tall, 1.5 m apart, cresting the ridge as they climb.
         Each gate gets its own slightly-different vermilion, as in life. */
      for(let i=0;i<90;i++){
        const z=i*S(3.0), yy=S(2.0)+i*S(0.42);          // the stair up the hill
        const red=M(i%7===0?'#d2452f':'#c0392b',{roughness:0.75});
        box(g,S(0.6),S(4.2),S(0.6),null,-S(1.5),yy+S(2.1),z,red);
        box(g,S(0.6),S(4.2),S(0.6),null, S(1.5),yy+S(2.1),z,red);
        // kasagi: the top lintel, and the shimaki just under it
        box(g,S(5.0),S(0.45),S(0.7),null,0,yy+S(4.35),z,red);
        box(g,S(4.2),S(0.28),S(0.55),null,0,yy+S(3.95),z,red);
        // nuki: the tie beam across the posts
        box(g,S(3.8),S(0.34),S(0.45),null,0,yy+S(3.15),z,red);
      }
      root.add(g); made.push('Fushimi Inari torii'); }
    return made.join(' · ');
  },

  /* ---------------- Riyadh ---------------- */
  riyadh(plots, root){
    const made=[];
    const kc = plots.find(p=>p.name.includes('Kingdom'));
    if(kc){ const g=new THREE.Group(); g.position.set(kc.x,0,kc.z);
      const glass=M('#7d8b93',{roughness:0.28,metalness:0.78});
      /* 302 m, 41 floors. The tower rises as a slab to 250 m, then the
         inverted-arch skybridge cut-out spans the top block. Height is fitted
         at the end, so build it at a readable 1:1 and let fitH place the top. */
      /* The signature of the tower is the huge inverted-catenary opening at the
         top: the two long sides sweep up and meet in a skybridge, and you can
         see daylight through the middle. The opening is ~34 m wide and ~75 m
         tall, so the shaft has to stop low enough for it to read. */
      box(g,S(41),S(196),S(41),null,0,S(98),0,glass);          // the shaft
      const bridge=M('#9aa8b0',{roughness:0.3,metalness:0.75});
      // the two legs of the arch, rising and leaning in
      for (const sx of [-1,1]){
        const leg=new THREE.Mesh(new THREE.BoxGeometry(S(7.0), S(96), S(41)), bridge);
        leg.position.set(sx*S(14.5), S(240), 0);
        leg.rotation.z = -sx*0.10;                             // lean towards the bridge
        leg.castShadow = true; g.add(leg);
      }
      // the skybridge deck closing the arch at the top
      box(g,S(41),S(18),S(41),null,0,S(290),0,bridge);
      box(g,S(43),S(3),S(43),null,0,S(302),0,M('#c8d0d4',{metalness:0.8,roughness:0.25}));
      fitH2(g, 302); root.add(g); made.push('Kingdom Centre'); }
    const fa = plots.find(p=>p.name.includes('Faisaliah'));
    if(fa){ const g=new THREE.Group(); g.position.set(fa.x,0,fa.z);
      /* 267 m. The shaft tapers, the 24 m gold sphere sits near 200 m, and a
         slender mast carries it to the tip. */
      cyl(g,S(11),S(22),S(200),20,null,0,S(100),0,M('#a8b0b4',{roughness:0.3,metalness:0.7}));
      const ball=new THREE.Mesh(new THREE.SphereGeometry(S(12),24,16),GOLD());
      ball.position.set(0,S(206),0); ball.castShadow=true; g.add(ball);
      // the glazed viewing deck just under the ball
      cyl(g,S(15),S(13),S(8),20,null,0,S(190),0,M('#8fa0a8',{roughness:0.2,metalness:0.8}));
      cone(g,S(1.6),S(49),8,null,0,S(242),0,M('#c0c8cc',{metalness:0.6,roughness:0.35}));
      fitH2(g, 267); root.add(g); made.push('Al-Faisaliah'); }
    const ms = plots.find(p=>p.name.includes('Masmak'));
    if(ms){ const g=new THREE.Group(); g.position.set(ms.x,0,ms.z);
      box(g,S(60),S(12),S(50),null,0,S(6),0,M('#c69a6a'));
      [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{
        cyl(g,S(5),S(6),S(20),10,null,a*S(26),S(10),b*S(21),M('#b88a5a'));
        cone(g,S(5.5),S(5),10,null,a*S(26),S(22),b*S(21),M('#a87a4a')); });
      fitH2(g, 20); root.add(g); made.push('Masmak Fort'); }
    return made.join(' · ');
  },

  /* ---------------- Islamabad ---------------- */
  islamabad(plots, root){
    const made=[];
    const fm = plots.find(p=>p.name.includes('Faisal'));
    if(fm){ const g=new THREE.Group(); g.position.set(fm.x,0,fm.z);
      // the tent: eight-sided folded shell, 40 m prayer hall
      const shell=M('#e8e4dc',{roughness:0.9});
      const t=new THREE.Mesh(new THREE.ConeGeometry(S(50),S(44),8,1,true), shell);
      t.position.set(0,S(22),0); t.material.side=THREE.DoubleSide; t.castShadow=true; g.add(t);
      [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>
        cyl(g,S(2.2),S(3.2),S(88),12,null,a*S(44),S(44),b*S(44),M('#dcd8d0')));
      root.add(g); made.push('Faisal Mosque'); }
    const pm = plots.find(p=>p.name.includes('Monument'));
    if(pm){ const g=new THREE.Group(); g.position.set(pm.x,0,pm.z);
      for(let i=0;i<4;i++){ const a=(i/4)*Math.PI/2+0.4;
        const petal=new THREE.Mesh(new THREE.ConeGeometry(S(12),S(26),3), M('#b9a184'));
        petal.position.set(Math.cos(a)*S(9),S(13),Math.sin(a)*S(9)); petal.castShadow=true; g.add(petal); }
      root.add(g); made.push('Pakistan Monument'); }
    return made.join(' · ');
  },

  /* ---------------- Gilgit / Murree ---------------- */
  gilgit(plots, root){
    const f = (plots||[]).find(p=>p.name.includes('Fort'));
    if(!f) return '';
    const g=new THREE.Group(); g.position.set(f.x,0,f.z);
    box(g,S(70),S(14),S(60),null,0,S(7),0,M('#b8a288'));
    [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{
      cyl(g,S(7),S(8),S(22),10,null,a*S(30),S(11),b*S(26),M('#a89278'));
      cone(g,S(7.5),S(6),10,null,a*S(30),S(25),b*S(26),M('#8a7660')); });
    root.add(g); return 'Gilgit Fort';
  },
  murree(plots, root){
    const m = (plots||[]).find(p=>p.name.includes('Mall'));
    if(!m) return '';
    const g=new THREE.Group(); g.position.set(m.x,0,m.z);
    // tin-roofed ridge frontage along the Mall
    for(let i=0;i<24;i++){
      const z=(i-12)*S(11);
      box(g,S(14),S(9),S(9),null,0,S(4.5),z,M(['#c9c3b0','#8f7f6a','#b3a793'][i%3]));
      const roof=M('#7a4235',{roughness:0.6});
      const r=new THREE.Mesh(new THREE.ConeGeometry(S(9),S(4),4),roof);
      r.position.set(0,S(11),z); r.rotation.y=Math.PI/4; r.castShadow=true; g.add(r);
    }
    root.add(g); return 'The Mall ridge';
  },

  /* ---------------- Cape Town ---------------- */
  capetown(plots, root){
    const made=[];
    const st = plots.find(p=>p.name.includes('Stadium'));
    if(st){ const g=new THREE.Group(); g.position.set(st.x,0,st.z);
      const ring=new THREE.Mesh(new THREE.TorusGeometry(S(70),S(16),10,40),
        M('#dfe3e6',{roughness:0.6,metalness:0.15}));
      ring.rotation.x=Math.PI/2; ring.position.y=S(18); ring.castShadow=true; g.add(ring);
      root.add(g); made.push('Cape Town Stadium'); }
    const vw = plots.find(p=>p.name.includes('Waterfront'));
    if(vw){ const g=new THREE.Group(); g.position.set(vw.x,0,vw.z);
      for(let i=0;i<10;i++) box(g,S(20),S(14+(i%4)*6),S(16),null,(i-4.5)*S(24),S(7),0,M('#e0ddd4'));
      root.add(g); made.push('V&A Waterfront'); }
    return made.join(' · ');
  },

  /* ---------------- Vancouver ---------------- */
  vancouver(plots, root){
    const cp = plots.find(p=>p.name.includes('Canada Place'));
    if(!cp) return '';
    const g=new THREE.Group(); g.position.set(cp.x,0,cp.z);
    box(g,S(120),S(16),S(50),null,0,S(8),0,M('#e6e4de'));
    // the five sails
    for(let i=0;i<5;i++){
      const sail=new THREE.Mesh(new THREE.ConeGeometry(S(14),S(22),4), M('#f2f1ee',{roughness:0.8}));
      sail.position.set((i-2)*S(24),S(27),0); sail.rotation.y=Math.PI/4; sail.castShadow=true; g.add(sail);
    }
    root.add(g); return 'Canada Place sails';
  },
  };

  /* ===================================================================
     Covens: every remaining plot that had no builder. Each is measured
     from published dimensions and placed on its own surveyed plot.
     =================================================================== */
  /* Landmarks are hand-built from primitives, and hand-built things drift: a
     dome added on top of a box quietly makes the whole thing 60% too tall, or
     a missing spire leaves it 40% too short. fitH2() measures the finished group
     and scales it uniformly so the top lands on the published height. Uniform
     scaling keeps the proportions the builder got right.
     target is in METRES; the scene is 1 unit = 2 m. */

  const MORE = {

  /* Makkah: Jabal al-Nour (the Cave of Hira) and Mina with the Jamarat */
  makkah(plots, root){
    const made=[];
    const jn = plots.find(p=>/nour/i.test(p.name));
    if (jn){
      const g = new THREE.Group(); g.position.set(jn.x, 0, jn.z);
      /* the mountain: a steep dark cone, ~640 m above the plain */
      const rock = M('#6b5f52', {roughness:1.0});
      cone(g, S(190), S(300), 9, '#6b5f52', 0, S(150), 0, rock);
      // the lighter scree near the summit and the cave mouth
      cone(g, S(46), S(60), 9, '#8a7d6b', 0, S(300), 0, M('#8a7d6b',{roughness:1}));
      const cave = new THREE.Mesh(new THREE.BoxGeometry(S(9), S(7), S(9)),
                                  M('#14100c', {roughness:1}));
      cave.position.set(0, S(310), S(22)); g.add(cave);
      // the stair up the flank, and the summit mosque
      for (let i=0;i<26;i++){
        const t=i/26, y=S(18)+t*S(288), rr=S(180)*(1-t*0.86)+S(6);
        box(g, S(5), S(1.0), S(3.2), null, 0, y, rr, M('#9c8e7a'));
      }
      box(g, S(16), S(7), S(12), null, 0, S(307), S(-12), M('#ded3bd'));
      dome(g, S(5), '#cfc4ac', 0, S(314), S(-12), M('#cfc4ac'));
      root.add(g); made.push('Jabal al-Nour + Cave of Hira');
    }
    const mn = plots.find(p=>/mina/i.test(p.name));
    if (mn){
      const g = new THREE.Group(); g.position.set(mn.x, 0, mn.z);
      /* Mina: the tent city. White fireproof tents in long rows — this is what
         the valley actually looks like from the air during Hajj. */
      const tent = M('#efe9dd', {roughness:0.95});
      const pole = M('#b9ae9a');
      for (let r=0; r<9; r++) for (let c=0; c<12; c++){
        if (((r*7 + c*11) % 13) === 0) continue;     // a few gaps, as in life
        const x = (c-5.5)*S(26), z = (r-4)*S(30);
        const t = new THREE.Mesh(new THREE.ConeGeometry(S(11), S(7.5), 4), tent);
        t.position.set(x, S(3.75), z); t.rotation.y = Math.PI/4; t.castShadow = true; g.add(t);
        // the flat wall band under each tent
        box(g, S(15.5), S(2.6), S(15.5), null, x, S(1.3), z, tent);
        box(g, S(15.8), S(0.5), S(15.8), null, x, S(2.7), z, pole);
      }
      /* Jamarat bridge: the long multi-level structure at the west end */
      const jb = new THREE.Group(); jb.position.set(S(-150), 0, 0);
      box(jb, S(30), S(12), S(110), null, 0, S(6), 0, M('#c9c2b4'));
      box(jb, S(30), S(12), S(110), null, 0, S(19), 0, M('#c2bbad'));
      for (const dz of [-S(36), 0, S(36)]){
        cyl(jb, S(4.4), S(4.4), S(26), 12, null, 0, S(13), dz, M('#b8b1a3'));
      }
      g.add(jb);
      root.add(g); made.push('Mina tent city + Jamarat');
    }
    return made.join(' · ');
  },

  /* Madinah: Quba Mosque — the first mosque, rebuilt as the modern structure */
  madinah(plots, root){
    const q = plots.find(p=>/quba/i.test(p.name));
    if (!q) return '';
    const g = new THREE.Group(); g.position.set(q.x, 0, q.z);
    const stone = M('#e8e2d4');
    /* 135 x 135 m plan, four minarets, a run of shallow domes, one big central */
    box(g, S(135), S(14), S(135), null, 0, S(7), 0, stone);
    box(g, S(120), S(4), S(120), null, 0, S(15), 0, M('#f0ebdf'));
    dome(g, S(15), '#efe9db', 0, S(17), 0, stone);
    cyl(g, S(13), S(13), S(9), 24, null, 0, S(17), 0, stone);
    for (let i=-2;i<=2;i++) for (let j=-2;j<=2;j++){
      if (!i && !j) continue;
      if ((Math.abs(i)+Math.abs(j)) > 2) continue;
      dome(g, S(6.5), '#eae4d6', S(i*32), S(17), S(j*32), stone);
    }
    for (const [sx,sz] of [[-1,-1],[1,-1],[-1,1],[1,1]]){
      cyl(g, S(3.4), S(4.4), S(48), 12, null, sx*S(60), S(24), sz*S(60), stone);
      cone(g, S(4.0), S(9), 12, null, sx*S(60), S(52), sz*S(60), M('#cfc7b4'));
    }
    root.add(g);
    return 'Quba Mosque';
  },

  /* Quds: the Holy Sepulchre and the Western Wall both sit inside Haram al-Sharif's
     radius, so they are built on their own offsets from the Haram centre. */
  quds(plots, root){
    const made = [];
    const h = plots.find(p=>/haram|dome of the rock/i.test(p.name));
    if (!h) return '';
    /* Holy Sepulchre: rotunda over the Edicule, 37 m dome, the bell tower */
    /* real geography relative to the Haram centre: the Holy Sepulchre is about
       370 m WNW of the Dome of the Rock. World x grows east, z grows south. */
    const MPU = 2;                       // metres per world unit
    const hs = new THREE.Group();
    hs.position.set(h.x - (370 * Math.cos(0.44)) / MPU, 0,
                    h.z - (370 * Math.sin(0.44)) / MPU);
    const stone = M('#cdc6b4');
    box(hs, S(70), S(16), S(60), null, 0, S(8), 0, stone);          // the basilica
    cyl(hs, S(21), S(21.5), S(20), 28, null, S(-14), S(28), 0, stone); // rotunda drum
    dome(hs, S(18.5), '#9a9a92', S(-14), S(38), 0, M('#9a9a92',{roughness:0.5,metalness:0.3}));
    cone(hs, S(3.4), S(10), 8, null, S(-14), S(58), 0, M('#8d8d85'));
    /* the Edicule inside is not modelled - no interiors, by instruction */
    box(hs, S(9), S(12), S(9), null, S(20), S(22), S(10), M('#d8d0bc')); // bell tower
    cone(hs, S(5.5), S(8), 4, null, S(20), S(32), S(10), M('#8d8d85'));
    fitH2(hs, 40); root.add(hs); made.push('Holy Sepulchre');
    /* Western Wall: the Herodian ashlar courses along the Haram's west edge */
    /* the Western Wall runs along the Haram's west edge, ~100 m west of the Rock */
    const ww = new THREE.Group(); ww.position.set(h.x - 100 / MPU, 0, h.z);
    const ashlar = M('#c8bda3', {roughness:0.95});
    for (let c=0; c<7; c++){
      box(ww, S(3.2), S(7.4), S(160), null, 0, S(3.7) + c*S(7.6), 0, ashlar);
      // a hairline joint between courses so the masonry reads as courses
      box(ww, S(3.5), S(0.25), S(160), null, 0, S(7.6) + c*S(7.6), 0, M('#a89d84'));
    }
    // the plaza paving in front of the wall
    box(ww, S(60), S(0.8), S(160), null, -S(32), S(0.4), 0, M('#cfc8b6'));
    fitH2(ww, 19); root.add(ww); made.push('Western Wall');
    return made.join(' · ');
  },

  /* Istanbul: Topkapi and Suleymaniye */
  istanbul(plots, root){
    const made=[];
    const tk = plots.find(p=>/topkapi/i.test(p.name));
    if (tk){
      const g=new THREE.Group(); g.position.set(tk.x,0,tk.z);
      const stone=M('#cfc4ac'), roof=M('#8a7f6a');
      // the four courtyards, as walled ranges around open ground
      box(g,S(220),S(9),S(16),null,0,S(4.5),-S(110),stone);
      box(g,S(220),S(9),S(16),null,0,S(4.5), S(110),stone);
      box(g,S(16),S(9),S(220),null,-S(102),S(4.5),0,stone);
      box(g,S(16),S(9),S(220),null, S(102),S(4.5),0,stone);
      // the palace ranges along the north and east sides
      box(g,S(200),S(12),S(24),null,0,S(6),S(88),stone);
      box(g,S(24),S(12),S(160),null,S(88),S(6),0,stone);
      box(g,S(200),S(3),S(24),null,0,S(13.5),S(88),roof);
      // the Baghdad Kiosk and the terraces over the water
      box(g,S(26),S(12),S(26),null,S(78),S(6),S(92),stone);
      dome(g,S(9),null,S(78),S(18),S(92),M('#6f6455',{roughness:0.6,metalness:0.2}));
      // the Gate of Salutation
      box(g,S(30),S(20),S(14),null,0,S(10),S(112),stone);
      cone(g,S(16),S(9),4,null,0,S(29),S(112),roof);
      fitH2(g, 28); root.add(g); made.push('Topkapi Palace');
    }
    const sl = plots.find(p=>/suleymaniye/i.test(p.name));
    if (sl){
      const g=new THREE.Group(); g.position.set(sl.x,0,sl.z);
      const stone=M('#d6cdb8');
      // 59 m dome, 53 m high; four semi-domes; four minarets at the corners
      box(g,S(72),S(22),S(72),null,0,S(11),0,stone);
      dome(g,S(18),'#8b9088',0,S(22),0,M('#8b9088',{roughness:0.55,metalness:0.2}));
      cyl(g,S(17),S(17),S(10),28,null,0,S(26),0,stone);
      for (const [dx,dz] of [[-1,-1],[1,-1],[-1,1],[1,1]])
        dome(g,S(9),'#8b9088',dx*S(26),S(22),dz*S(26),M('#8b9088',{roughness:0.55}));
      for (const [sx,sz] of [[-1,-1],[1,-1],[-1,1],[1,1]]){
        cyl(g,S(2.8),S(3.6),S(52),12,null,sx*S(44),S(26),sz*S(44),stone);
        cone(g,S(3.2),S(10),12,null,sx*S(44),S(57),sz*S(44),M('#6b7368'));
      }
      // the mausoleum behind
      box(g,S(24),S(14),S(20),null,0,S(7),-S(56),stone);
      dome(g,S(9),'#8b9088',0,S(14),-S(56),M('#8b9088',{roughness:0.55}));
      fitH2(g, 53); root.add(g); made.push('Suleymaniye');
    }
    return made.join(' · ');
  },

  /* Venice: Rialto and the Salute */
  venice(plots, root){
    const made=[];
    const rt = plots.find(p=>/rialto/i.test(p.name));
    if (rt){
      const g=new THREE.Group(); g.position.set(rt.x,0,rt.z);
      /* 48 m span, 22.9 m wide, 7.3 m rise, a single stone arch with shops on it */
      const stone=M('#e3d9c2');
      const arch=new THREE.Mesh(new THREE.TorusGeometry(S(24),S(3.2),10,26,Math.PI),
                                M('#ddd3bb',{roughness:0.9}));
      arch.position.set(0,S(7.3),0); arch.rotation.z=0; arch.castShadow=true; g.add(arch);
      // the deck over the arch and the shop row
      box(g,S(22),S(2.4),S(48),null,0,S(8.6),0,stone);
      box(g,S(20),S(6),S(48),null,0,S(12.8),0,stone);
      for (let i=0;i<7;i++) box(g,S(19),S(1.0),S(5.6),null,0,S(16.2),-S(21)+i*S(7),M('#8a8378'));
      fitH2(g, 22); root.add(g); made.push('Rialto Bridge');
    }
    const sm = plots.find(p=>/salute/i.test(p.name));
    if (sm){
      const g=new THREE.Group(); g.position.set(sm.x,0,sm.z);
      const stone=M('#eae4d4');
      // the octagonal church: 110 m long, 61 m to the top of the dome
      const oct=new THREE.Mesh(new THREE.CylinderGeometry(S(30),S(32),S(30),8),
                               M('#eae4d4',{roughness:0.9}));
      oct.position.set(0,S(15),0); oct.castShadow=true; g.add(oct);
      dome(g,S(22),'#dad3c2',0,S(30),0,M('#dad3c2',{roughness:0.7,metalness:0.15}));
      cyl(g,S(21),S(21),S(10),24,null,0,S(33),0,stone);
      // the great volutes buttressing the dome
      for (let i=0;i<8;i++){
        const a=(i/8)*Math.PI*2;
        cyl(g,S(2.2),S(3.0),S(16),8,null,Math.cos(a)*S(30),S(34),Math.sin(a)*S(30),
            M('#e0d9c8',{roughness:0.9}));
      }
      // the campanile at the back
      box(g,S(9),S(38),S(9),null,0,S(19),-S(52),stone);
      cone(g,S(6),S(9),4,null,0,S(46),-S(52),M('#7d8a7a'));
      fitH2(g, 61); root.add(g); made.push('Santa Maria della Salute');
    }
    return made.join(' · ');
  },

  /* Prague: Charles Bridge, Tyn Church, Astronomical Clock, Powder Tower */
  prague(plots, root){
    const made=[];
    const cb = plots.find(p=>/charles/i.test(p.name));
    if (cb){
      const g=new THREE.Group(); g.position.set(cb.x,0,cb.z);
      const stone=M('#cdc4ae');
      // 516 m long, 9.5 m wide, 13 m above the river, 30 statues
      box(g,S(9.5),S(2.0),S(516),null,0,S(1.0),0,stone);
      for (let i=0;i<9;i++){                     // piers
        const z=-S(230)+i*S(58);
        cyl(g,S(4.2),S(5.0),S(13),10,null,0,S(-5.5),z,M('#bdb49e'));
        box(g, S(6.6),S(11),S(6.6),null,0,S(-5.5),z,M('#bdb49e'));
      }
      // the statue row, both sides
      for (let i=0;i<30;i++){
        const z=-S(244)+i*S(17);
        for (const sx of [-1,1]){
          box(g,S(1.4),S(3.4),S(1.4),null,sx*S(4.0),S(3.7),z,M('#9d9482'));
          box(g,S(2.2),S(0.6),S(2.2),null,sx*S(4.0),S(5.6),z,M('#8d8472'));
        }
      }
      // the two bridge towers
      box(g,S(11),S(18),S(11),null,0,S(9),S(250),stone);
      cone(g,S(8),S(11),4,null,0,S(23),S(250),M('#5f6b63'));
      box(g,S(11),S(15),S(11),null,0,S(7.5),-S(250),stone);
      fitH2(g, 20); root.add(g); made.push('Charles Bridge');
    }
    const ty = plots.find(p=>/tyn/i.test(p.name));
    if (ty){
      const g=new THREE.Group(); g.position.set(ty.x,0,ty.z);
      // twin black spires, 80 m, ringed with smaller pinnacles
      box(g,S(24),S(22),S(44),null,0,S(11),0,M('#d8cfbc'));
      for (const sx of [-1,1]){
        box(g,S(9),S(26),S(9),null,sx*S(6),S(35),0,M('#4a4a4a'));
        cone(g,S(5.4),S(30),4,null,sx*S(6),S(63),0,M('#3f3f3f'));
        for (const dz of [-1,1]) {
          cone(g,S(2.0),S(12),4,null,sx*S(10),S(52),dz*S(6),M('#3f3f3f'));
        }
      }
      fitH2(g, 80); root.add(g); made.push('Tyn Church');
    }
    const ac = plots.find(p=>/clock/i.test(p.name));
    if (ac){
      const g=new THREE.Group(); g.position.set(ac.x,0,ac.z);
      box(g,S(20),S(26),S(18),null,0,S(13),0,M('#d5ccb8'));
      // the astronomical dial: blue-gold face, ~2.5 m across
      const dial=new THREE.Mesh(new THREE.CircleGeometry(S(2.5),28),
        M('#2b4a6f',{roughness:0.5,metalness:0.2}));
      dial.position.set(0,S(16),S(9.1)); g.add(dial);
      const ring=new THREE.Mesh(new THREE.TorusGeometry(S(2.5),S(0.25),8,28),GOLD());
      ring.position.set(0,S(16),S(9.2)); g.add(ring);
      cone(g,S(6),S(16),4,null,0,S(34),0,M('#3f3f3f'));
      fitH2(g, 70); root.add(g); made.push('Astronomical Clock');
    }
    const pt = plots.find(p=>/powder/i.test(p.name));
    if (pt){
      const g=new THREE.Group(); g.position.set(pt.x,0,pt.z);
      box(g,S(14),S(42),S(14),null,0,S(21),0,M('#c9c0aa'));
      cone(g,S(9),S(18),4,null,0,S(51),0,M('#4a4a4a'));
      fitH2(g, 65); root.add(g); made.push('Powder Tower');
    }
    return made.join(' · ');
  },

  /* Kyoto: Kiyomizu-dera and Nijo Castle */
  kyoto(plots, root){
    const made=[];
    const kd = plots.find(p=>/kiyomizu/i.test(p.name));
    if (kd){
      const g=new THREE.Group(); g.position.set(kd.x,0,kd.z);
      const wood=M('#8a5a3c'), roofM=M('#5c4a3a');
      /* the great hall on its 13 m stage, cantilevered on 139 pillars */
      box(g,S(34),S(13),S(30),null,0,S(6.5),0,M('#b8ae9c'));      // the platform
      for (let i=0;i<39;i++){                                     // the pillar forest
        const x=-S(16)+(i%13)*S(2.6), z=-S(14)+Math.floor(i/13)*S(14);
        box(g,S(1.1),S(13),S(1.1),null,x,S(6.5),z,wood);
      }
      box(g,S(38),S(9),S(34),null,0,S(17),0,wood);                // the hall
      // the sweeping hinoki-bark roof
      const rf=new THREE.Mesh(new THREE.ConeGeometry(S(30),S(11),4), roofM);
      rf.position.set(0,S(27),0); rf.rotation.y=Math.PI/4; rf.castShadow=true; g.add(rf);
      // the three-storey pagoda to the side
      for (let i=0;i<3;i++){
        const w=S(14)-i*S(2);
        box(g,w,S(5),w,null,S(-46),S(3)+i*S(7),S(20),wood);
        box(g,w*1.5,S(2.2),w*1.5,null,S(-46),S(6)+i*S(7),S(20),roofM);
      }
      cone(g,S(1),S(10),6,null,S(-46),S(30),S(20),M('#6b5a44'));
      // the hall itself is 13 m on its stage; the group's top is the pagoda
      fitH2(g, 31); root.add(g); made.push('Kiyomizu-dera');
    }
    const nj = plots.find(p=>/nijo/i.test(p.name));
    if (nj){
      const g=new THREE.Group(); g.position.set(nj.x,0,nj.z);
      const wallM=M('#d8cfbc'), roofM=M('#5c4a3a');
      // the outer moat and wall, then Ninomaru Palace's nightingale floors
      box(g,S(300),S(4),S(300),null,0,S(2),0,M('#8a9a8a'));
      box(g,S(240),S(8),S(240),null,0,S(4),0,M('#cfc6b2'));
      box(g,S(120),S(8),S(70),null,0,S(8),S(60),wallM);
      box(g,S(128),S(3),S(78),null,0,S(13.5),S(60),roofM);
      // the keep (tenshu)
      box(g,S(30),S(22),S(24),null,S(-70),S(11),S(-60),wallM);
      box(g,S(34),S(3),S(28),null,S(-70),S(23.5),S(-60),roofM);
      box(g,S(22),S(10),S(18),null,S(-70),S(30),S(-60),wallM);
      box(g,S(26),S(3),S(22),null,S(-70),S(36.5),S(-60),roofM);
      fitH2(g, 14); root.add(g); made.push('Nijo Castle');
    }
    return made.join(' · ');
  },

  /* Riyadh: KAFD — the King Abdullah Financial District skyline */
  riyadh(plots, root){
    const kd = plots.find(p=>/kafd/i.test(p.name));
    if (!kd) return '';
    const g=new THREE.Group(); g.position.set(kd.x,0,kd.z);
    const glassA=M('#8fa0a8',{roughness:0.25,metalness:0.7});
    const glassB=M('#a3b0b4',{roughness:0.3,metalness:0.65});
    /* the district's real signature towers, roughly to height */
    const towers=[
      [-S(60), -S(40), S(40), S(385), glassA],   // PIF Tower, 385 m
      [ S(78), -S(30), S(30), S(240), glassB],
      [ S(10),  S(66), S(32), S(205), glassA],
      [-S(86),  S(74), S(24), S(170), glassB],
      [ S(96),  S(80), S(22), S(140), glassA],
      [-S(20), -S(96), S(20), S(120), glassB],
    ];
    for (const [x,z,w,h,m] of towers){
      box(g, w, h, w, null, x, h/2, z, m);
      // a crown, so they are not plain extrusions
      box(g, w*1.06, S(4), w*1.06, null, x, h + S(2), z, M('#c8d0d4',{metalness:0.7,roughness:0.3}));
    }
    // the podium and the elevated walkways between them
    box(g, S(240), S(16), S(240), null, 0, S(8), 0, M('#c6bda8'));
    for (const [x1,z1,x2,z2] of [[-S(60),-S(40),S(70),-S(30)],[S(10),S(60),S(95),S(75)]]){
      const dx=x2-x1, dz=z2-z1, len=Math.hypot(dx,dz);
      const bar=new THREE.Mesh(new THREE.BoxGeometry(S(5),S(4),len), M('#d8d2c4'));
      bar.position.set((x1+x2)/2, S(18), (z1+z2)/2);
      bar.lookAt(new THREE.Vector3(x2, S(18), z2)); bar.castShadow=true; g.add(bar);
    }
    root.add(g);
    return 'KAFD towers';
  },

  /* Cape Town: Bo-Kaap — the coloured terrace houses */
  capetown(plots, root){
    const bk = plots.find(p=>/bo-?kaap/i.test(p.name));
    if (!bk) return '';
    const g=new THREE.Group(); g.position.set(bk.x,0,bk.z);
    /* the famous painted facades: pink, lime, turquoise, yellow, periwinkle.
       Narrow terraces stepped up the slope. */
    const PAL=['#e8a0a8','#d9d98a','#8ac6c8','#e8cf8a','#a8a8d8','#e8b8a0','#9ac89a','#d8c8e0'];
    for (let row=0; row<6; row++){
      for (let i=0;i<14;i++){
        if (((row*5+i*3) % 11) === 0) continue;
        const x = -S(70) + i*S(11), z = -S(40) + row*S(15);
        const c = PAL[(row*14+i) % PAL.length];
        box(g, S(9), S(7) + (row%3)*S(1.2), S(12), null, x, (7+(row%3)*1.2)*U/2, z, M(c,{roughness:0.9}));
        // flat roof with the little parapet Bo-Kaap houses have
        box(g, S(9.6), S(0.6), S(12.6), null, x, S(7+(row%3)*1.2)+S(0.3), z, M('#efeae0'));
        // stoep (the raised front step) and the door
        box(g, S(9), S(0.8), S(2.0), null, x, S(0.4), z+S(7), M('#d8d2c6'));
      }
    }
    // the Bo-Kaap mosque with its green minaret and dome
    const mq=new THREE.Group(); mq.position.set(S(30),0,S(52));
    box(mq,S(26),S(9),S(26),null,0,S(4.5),0,M('#e2ded2'));
    dome(mq,S(8),'#3f8a6a',0,S(9),0,M('#3f8a6a',{roughness:0.6}));
    cyl(mq,S(2.6),S(3.0),S(22),10,null,S(18),S(11),0,M('#e2ded2'));
    cone(mq,S(3.0),S(6),10,null,S(18),S(25),0,M('#3f8a6a'));
    g.add(mq);
    root.add(g);
    return 'Bo-Kaap terraces';
  },

  /* Vancouver: Granville Island — the public market under the bridge */
  vancouver(plots, root){
    const gi = plots.find(p=>/granville/i.test(p.name));
    if (!gi) return '';
    const g=new THREE.Group(); g.position.set(gi.x,0,gi.z);
    const shed=M('#9aa39a'), roof=M('#7d867d');
    // the market sheds: long low gabled halls, corrugated
    for (let i=0;i<5;i++){
      const z = -S(60) + i*S(30);
      box(g, S(60), S(9), S(24), null, 0, S(4.5), z, shed);
      const rf=new THREE.Mesh(new THREE.CylinderGeometry(S(13),S(13),S(62),12,1,false,0,Math.PI), roof);
      rf.rotation.z=Math.PI/2; rf.rotation.y=Math.PI/2;
      rf.position.set(0,S(9),z); rf.scale.set(1,0.28,1); rf.castShadow=true; g.add(rf);
    }
    // the concrete piers the island sits on, and the False Creek edge
    for (let i=0;i<6;i++) box(g,S(8),S(4),S(8),null,-S(34),S(-1),-S(70)+i*S(28),M('#b0b0a8'));
    // the Granville Bridge overhead: the decks that cross the island
    box(g, S(200), S(3), S(18), null, 0, S(46), S(-20), M('#a8a89e'));
    for (const x of [-S(60), 0, S(60)])
      box(g, S(7), S(46), S(7), null, x, S(23), S(-20), M('#a8a89e'));
    root.add(g);
    return 'Granville Island market';
  },
  };

  const prev = LM.build;
  LM.build = function(scene, city, plots){
    const res = prev(scene, city, plots||[]);
    const fn = EXTRA[city];
    if (fn){
      const h = (plots||[]).find(p=>/haram|nabawi|dome/i.test(p.name)) || (plots||[])[0] || {x:0,z:0};
      let out;
      try { out = fn((plots||[]), res.group); }
      catch(e){ out = ''; console.warn('[landmarks] extra failed', city, e); }
      if (out) res.made.push(out);
    }
    const moreFn = MORE[city];
    if (moreFn){
      let out2;
      try { out2 = moreFn(plots||[], res.group); }
      catch(e){ out2 = ''; console.warn('[landmarks] more failed', city, e); }
      if (out2) res.made.push(out2);
    }
    const note = document.getElementById('lmnote');
    if (note) note.textContent = res.made.join(' · ');
    return res;
  };
})();
