import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  helper = new JwtHelperService();

  token: any = localStorage.getItem('token')
  headerAdmin = new HttpHeaders()
    .set('authorization', this.token)
    .set('role', 'Admin')

  constructor(private http: HttpClient) { }


  /* getUserIdFromToken(): string {
    try {
      if (this.token) {
        console.log('Token:', this.token);
        let decodeToken = this.helper.decodeToken(this.token);
        console.log("Decoded token:", decodeToken);
        let id = decodeToken.id;
        console.log("ID user from token: ", id);
        return id;
      } else {
        console.log("No Token in Storage");
        return '';
      }
    } catch (error) {
      console.error('Error extracting user ID from token:', error);
      return '';
    }
  }
 */


  getAllUsers() {
    return this.http.get<any>('http://127.0.0.1:2000/admin/users', { headers: this.headerAdmin });

  }
  onDelete(id: string) {
    return this.http.delete<any>('http://127.0.0.1:2000/admin/user' + id, { headers: this.headerAdmin })
  }

  getOneUser(id: string): Observable<any> {
    return this.http.get<any>('http://127.0.0.1:2000/admin/user/' + id, { headers: this.headerAdmin });
  }


  getAllEquipes() {
    return this.http.get<any>('http://127.0.0.1:2000/admin/equipes', { headers: this.headerAdmin })

  }

  getOneEquipe(id: string): Observable<any> {
    return this.http.get<any>('http://127.0.0.1:2000/admin/equipe/' + id, { headers: this.headerAdmin });
  }

  onDeleteEquipe(id: string) {
    return this.http.delete<any>('http://127.0.0.1:2000/admin/equipe/' + id, { headers: this.headerAdmin })
  }

  modifierEquipe(id: string, titre: string): Observable<any> {
    return this.http.put<any>('http://127.0.0.1:2000/admin/equipe/' + id + '/modifierEquipe', { titre }, { headers: this.headerAdmin });
  }

  assignEquipeToUser(userId: string, equipeId: string): Observable<any> {
    return this.http.put<any>('http://127.0.0.1:2000/admin/users/' + userId + '/assign-equipe', { equipeId }, { headers: this.headerAdmin });
  }

  addEquipe(titre: string): Observable<any> {
    return this.http.post<any>('http://127.0.0.1:2000/admin/createEquipe', { titre }, { headers: this.headerAdmin });
  }



  getAllProfils() {
    return this.http.get<any>('http://127.0.0.1:2000/admin/profils', { headers: this.headerAdmin })

  }

  getOneProfil(id: string): Observable<any> {
    return this.http.get<any>('http://127.0.0.1:2000/admin/profil/' + id, { headers: this.headerAdmin });
  }

  onDeleteProfil(id: string) {
    return this.http.delete<any>('http://127.0.0.1:2000/admin/profil/' + id, { headers: this.headerAdmin })
  }

  modifierProfil(id: string, titre: string, menu_id: string): Observable<any> {
    return this.http.put<any>('http://127.0.0.1:2000/admin/profil/' + id + '/modifierProfil', { titre, menu_id }, { headers: this.headerAdmin });
  }

  assignProfilToUser(userId: string, profilId: string): Observable<any> {
    return this.http.put<any>('http://127.0.0.1:2000/admin/users/' + userId + '/assign-profil', { profilId }, { headers: this.headerAdmin });
  }



  getOneMenu(id: string): Observable<any> {
    return this.http.get<any>('http://127.0.0.1:2000/admin/Menu/' + id, { headers: this.headerAdmin });
  }

  addMenu(
    titre: string,
    createProject: boolean,
    modifierProjet: boolean,
    deleteProjet: boolean,
    createEnvironnement: boolean,
    modifierEnvironnement: boolean,
    deleteEnvironnement: boolean,
    getAllEnvironnement: boolean,
    getOneEnvironnement: boolean,
    createTicket: boolean,
    modifierTicket: boolean,
    getAllCommentaireInTicket: boolean,
    createCommentaire: boolean,
    updateCommentaire: boolean,
    deleteCommentaire: boolean,
    menuId: string
  ): Observable<any> {
    return this.http.post<any>('http://127.0.0.1:2000/admin/createMenu', {
      titre,
      createProject,
      modifierProjet,
      deleteProjet,
      createEnvironnement,
      modifierEnvironnement,
      deleteEnvironnement,
      getAllEnvironnement,
      getOneEnvironnement,
      createTicket,
      modifierTicket,
      getAllCommentaireInTicket,
      createCommentaire,
      updateCommentaire,
      deleteCommentaire,
      menu: menuId  // Pass the menuId
    }, { headers: this.headerAdmin });
  }

  addProfil(titre: string): Observable<any> {
    return this.http.post<any>('http://127.0.0.1:2000/admin/createProfil', { titre }, { headers: this.headerAdmin });
  }





  modifierMenu(
    id: string,
    titre: string,
    createProject: boolean,
    modifierProjet: boolean,
    deleteProjet: boolean,
    createEnvironnement: boolean,
    modifierEnvironnement: boolean,
    deleteEnvironnement: boolean,
    getAllEnvironnement: boolean,
    getOneEnvironnement: boolean,
    createTicket: boolean,
    modifierTicket: boolean,
    getAllCommentaireInTicket: boolean,
    createCommentaire: boolean,
    updateCommentaire: boolean,
    deleteCommentaire: boolean
  ): Observable<any> {
    return this.http.put<any>('http://127.0.0.1:2000/admin/Menu/' + id, {
      titre,
      createProject,
      modifierProjet,
      deleteProjet,
      createEnvironnement,
      modifierEnvironnement,
      deleteEnvironnement,
      getAllEnvironnement,
      getOneEnvironnement,
      createTicket,
      modifierTicket,
      getAllCommentaireInTicket,
      createCommentaire,
      updateCommentaire,
      deleteCommentaire
    }, { headers: this.headerAdmin });
  }

  assignMenuToProfil(profilId: string, menuId: string): Observable<any> {
    return this.http.put<any>(`http://127.0.0.1:2000/admin/profil/${profilId}/assign-Menu`, { MenuId: menuId }, { headers: this.headerAdmin });
  }
  deactivateUser(id: string) {
    return this.http.put(`http://127.0.0.1:2000/admin/users/${id}/deactivate`, { active: false }, { headers: this.headerAdmin });
  }
  activateUser(id: string) {
    return this.http.put(`http://127.0.0.1:2000/admin/users/${id}/activate`, { active: true }, { headers: this.headerAdmin });
  }
  deleteUser(id: string) {
    return this.http.delete<any>('http://127.0.0.1:2000/admin/user/' + id, { headers: this.headerAdmin })
  }

  getAllProjets() {
    return this.http.get<any>('http://127.0.0.1:2000/admin/projects', { headers: this.headerAdmin })
  }
  getOneProjet(projetId: string) {
    return this.http.get<any>('http://127.0.0.1:2000/admin/projet/' + projetId, { headers: this.headerAdmin });
  }

   getOneEnvironnement(id: string): Observable<any> {


    return this.http.get<any>(`http://127.0.0.1:2000/admin/environnement/` + id, { headers: this.headerAdmin });
  }

  getAllAdmins() {
    return this.http.get<any>('http://127.0.0.1:2000/admin/admins', { headers: this.headerAdmin })
  }

}

