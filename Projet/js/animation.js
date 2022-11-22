
// setTimeout(() => {
//     console.log("liste : ", liste_dis_quilles[1]);
// }, 1000);

let quilles1;
let quilles2;

setTimeout(() => {
    quilles1 = deep_copy(liste_dis_quilles[0]);
    quilles2 = deep_copy(liste_dis_quilles[1]);
}, 1000);

//fonction qui prends une liste de points (vecteurs) et 
//bouge un objet (mesh) suivant ces points.
//equipe vaut soit 1 (pour l'équipe gauche) soit
// 2 pour l'équipe droite.
function bouger(obj, points, equipe){
    let quilles;
    if(equipe == 1){
        quilles = quilles1;
    }else {
        quilles = quilles2;
    }

    j = 0;

    x0 = obj.position.x;
    y0 = obj.position.y;
    let pass = true;

    let count = 0;

    // quilles = deep_copy(liste_dis_quilles[equipe-1]);

    let interval = setInterval(() => {

        // console.log(obj.position);

        if(j < points.length){

            posx = points[j].x;
            posy = points[j].y;

            obj.position.x = posx;
            obj.position.y = posy;

            // console.log(posx, posy);

            if(j>0 && j< points.length-1){
                //calculer l'angle de rotation : angle = R/arc

                let d = distance(points[j-1], points[j]);
                if(d > 0){
                    let rot_angle = d / R;
                    let vect_dir_1 = new THREE.Vector2(points[j].x - points[j-1].x, points[j].y - points[j-1].y);
                    vect_dir_1.normalize();
                    let vect_dir_2 = new THREE.Vector2(points[j+1].x - points[j].x, points[j+1].y - points[j].y);
                    vect_dir_2.normalize();
                    let O = new THREE.Vector2(0, 0);
                    let rot_axis_2d = vect_dir_1.rotateAround(O, Math.PI/2);
                    let rot_axis_3d = new THREE.Vector3(rot_axis_2d.x, rot_axis_2d.y, 0);
                    let z_axis = new THREE.Vector3(0, 0, 1);

                    let rot_z = vect_dir_2.angle() - vect_dir_1.angle();
                    

                    count++;
                    // console.log(count);
                    // console.log(vect_dir_1, vect_dir_2);
                    // console.log(rot_z);


                    // console.log(d, rot_angle, rot_z);
                    // console.log(points[j-1], points[j])



                    obj.rotateOnAxis(z_axis, rot_z);
                    obj.rotateOnAxis(rot_axis_3d, - rot_angle);

                    // obj.rotateOnAxis(new THREE.Vector3(0,1,0), - rot_angle);
                }


            }
            
            // variable qui va stoquer les pts du cercle fait 
            //par l'ombre de la boule.
            let bordures = bordures_ombre(posx, posy, R, 15);

            if(posx <= R + 0.33){
                for (let i = 0; i < quilles.length; i++) {
                    const quille = quilles[i];
                    pass = true;
                    
                    for (let pts = 0; pts < bordures.length; pts++) {

                        
                        //si la quille courante n'est pas déja reduite en parallélopidpède
                        if(pass){

                            const pt = bordures[pts];
                            
                            if(check_disque(pt[0], pt[1], quille.position.posx, quille.position.posy, r_quille)){
                                remplace_quille_para(equipe, quille, i, quilles);
                                pass = false
                            }

                        }

                    }

                }

            }


            j++;
        } else {
            obj.position.x = x0;
            obj.position.y = y0;

            if(equipe == 2 && type_traj_d == 'non rect' && quilles2.length > 0){
                courbe_aleratoire_d = generer_courbe(equipe_2_c_bis);
                pts_bezier_d = courbe_aleratoire_d[0];
                traj_droite = pts_bezier_d;
                effacer(bezier_d);
                bezier_d = courbe_aleratoire_d[1];
                ajouter(bezier_d);
            } else if(equipe == 1 && type_traj_g == 'non rect' && quilles1.length > 0){
                courbe_aleratoire_g = generer_courbe(equipe_1_c);
                pts_bezier_g = courbe_aleratoire_g[0];
                traj_gauche = pts_bezier_g;

                effacer(bezier_g);
                bezier_g = courbe_aleratoire_g[1];
                translater_pts(pts_bezier_g, bezier_g, - 6.1);
                ajouter(bezier_g);
            }

            clearInterval(interval);
        }
    }, 100);

}







// fonction qui calcule la distance entre deux pts
function distance(p1, p2){
    return Math.sqrt( Math.pow(p1.x - p2.x, 2) +  Math.pow(p1.y - p2.y, 2) +  Math.pow(p1.z - p2.z, 2) );
}










//fonction qui prépare des parallélopipèdes en position (x,y) 
//et du coté a
function parallelo(x, y, a, equipe){
    let f_bas;let f_haut;let f_derier;let f_devant;let f_gauche;let f_droite;
    if(equipe == "gauche"){
        f_bas = face_elementaire(vecteur(x-a/2, y-a/2, 0), vecteur(x-a/2, y+a/2, 0), vecteur(x+a/2, y+a/2, 0), vecteur(x+a/2, y-a/2, 0), 0xffffff);
        f_haut = face_elementaire(vecteur(x-a/2, y-a/2, a), vecteur(x-a/2, y+a/2, a), vecteur(x+a/2, y+a/2, a), vecteur(x+a/2, y-a/2, a), 0xffffff);
        f_derier = face_elementaire(vecteur(x-a/2, y-a/2, 0), vecteur(x-a/2, y+a/2, 0), vecteur(x-a/2, y+a/2, a), vecteur(x-a/2, y-a/2, a), 0xffffff);
        f_devant = face_elementaire(vecteur(a + x-a/2, y-a/2, 0), vecteur(a + x-a/2, y+a/2, 0), vecteur(a + x-a/2, y+a/2, a), vecteur(a + x-a/2, y-a/2, a), 0xffffff);
        f_gauche = face_elementaire(vecteur(x-a/2, y-a/2, 0), vecteur(x+a/2, y-a/2, 0), vecteur(x+a/2, y-a/2, a), vecteur(x-a/2, y-a/2, a), 0xffffff);
        f_droite = face_elementaire(vecteur(x-a/2, y-a/2+ a, 0), vecteur(x+a/2, y-a/2+ a, 0), vecteur(x+a/2, y-a/2 + a, a), vecteur(x-a/2, y-a/2 + a, a), 0xffffff);
    }
    
    return [f_bas, f_haut, f_derier, f_devant, f_gauche, f_droite] ;
}













//fonction qui calcule et retourne une liste de pts
//de l'ombre (disque) d'un objet, le disque a un rayon R à la position (x0, y0)
function bordures_ombre(x0, y0, R, echelle){
    pts_bordure_boule = []
    for (let phi = 0; phi < echelle; phi++) {

        x = R*Math.cos(phi) + x0
        y = R*Math.sin(phi) + y0

        pts_bordure_boule.push([x, y]);
        
    }
    return pts_bordure_boule;
}













// fonction qui prends un point : (x, y) 
//(sur le plan OXY) et vérifie si il se trouve 
//à l'intérieur d'un disque de rayon R et centre (x0, y0)
function check_disque(x, y, x0, y0, R){
    let dist_R = Math.sqrt( Math.pow( x-x0 , 2) + Math.pow( y-y0, 2) );

    if(dist_R <= R){

        // console.log("centre : (" + x0 + ", " + y0 + ")");

        return true;
    } else {
        return false;
    }
}

















//fonction qui prends l'equipe à laquelle appartient 
//une quille ainsi que son indice dans la liste : liste_dis_quille[equipe - 1],
// supprime la quille en question de la scene, la remplace par
// un parallélopipède de coté 0.01
function remplace_quille_para(equipe, quille_obj, indice, tab_quilles){

    scene.remove(quille_obj.quille);
    x = quille_obj.position.posx;
    y = quille_obj.position.posy;
    dessiner_parallelo(x, y, 0.1, "gauche");
    tab_quilles.splice(indice, 1);


    if(equipe == 1){
        // console.log("je suis la ", equipe);
        score_1++;
        document.getElementById("verte_score").innerHTML = score_1;
    } else if(equipe == 2){
        // console.log("je suis la ", equipe, quille_obj.x, quille_obj.y);
        score_2++;
        document.getElementById("orange_score").innerHTML = score_2;
    }

    
}



















function dessiner_parallelo(x, y, a, equipe){
    ajouter(parallelo(x, y, a, equipe)[0]);
    ajouter(parallelo(x, y, a, equipe)[1]);
    ajouter(parallelo(x, y, a, equipe)[2]);
    ajouter(parallelo(x, y, a, equipe)[3]);
    ajouter(parallelo(x, y, a, equipe)[4]);
    ajouter(parallelo(x, y, a, equipe)[5]);
}











//    FONCTION AJOUTER
//fonction qui ajoute un objet à la scene
function ajouter(obj){
    scene.add(obj);
}













// fonction qui copie en profendeur une liste
function deep_copy(list){
    let copied_list = [];
    for (let i = 0; i < list.length; i++) {
        const l = list[i];
        copied_list[i] = l;
    }

    return copied_list;
}










// fonction qui change la position de la camera
// et la direction

let old_state = false;
setInterval(function(){
  if(pos == 1 && old_state != btn_state){
    camera.position.x = 10.5;
    camera.position.y = -3.05;
    camera.position.z = 50;
    camera.lookAt(10.5, -3.05, 0);
    camera.zoom = 1;
    camera.updateProjectionMatrix();

    bouger(boule_verte, traj_gauche, 1);

    
  } else if(pos == 2 && old_state != btn_state){
    camera.position.x = 10.5;
    camera.position.y = 3.05;
    camera.position.z = 50;
    camera.lookAt(10.5, 3.05, 0);
    camera.zoom = 1;
    camera.updateProjectionMatrix();


    bouger(boule_orange, traj_droite, 2);
  }

  old_state = btn_state;

}, 100);