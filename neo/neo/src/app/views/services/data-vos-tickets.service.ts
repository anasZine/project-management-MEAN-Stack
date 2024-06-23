import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataVosTicketsService  {
  helper = new JwtHelperService();
  token: any = localStorage.getItem('token');
  headerUser = new HttpHeaders().set('authorization', this.token);


  constructor(private http: HttpClient) {

   }

  getUserIdFromToken(): string {
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

  getProjects() {
    let userId = this.getUserIdFromToken();
    return this.http.get(`http://127.0.0.1:2000/user/${userId}/projets`, { headers: this.headerUser });
  }
  getOneEquipe(id: string) {
    return this.http.get<any>('http://127.0.0.1:2000/equipe/' + id, { headers: this.headerUser });
  }


  onDelete(id: string, userId: string) {

    return this.http.delete<any>(`http://127.0.0.1:2000/projet/${id}/user/${userId}/deleteProjet`, { headers: this.headerUser });
  }

  onUpdate(id: string, titre:string,description:string,equipe:string,dateDebut:Date,dateFin:Date, userId: string) {
    console.log('Updated Project:', titre,description,equipe,dateDebut,dateFin); // Log the updated project
    return this.http.put<any>(`http://127.0.0.1:2000/projet/${id}/user/${userId}/modifierProjet`, {titre,description,equipe,dateDebut,dateFin}, { headers: this.headerUser })
      .pipe(
        catchError((error) => {
          console.error('Error updating project:', error);
          throw error;
        })
      );
  }
  getEquipes() {
    return this.http.get<any>('http://127.0.0.1:2000/equipes', { headers: this.headerUser });
  }

  getOneProjet() {
    return this.http.get<any>('http://127.0.0.1:2000/projet/:projetId', { headers: this.headerUser });
  }




  createProject(newProject: any, userId: string) {
    console.log(newProject); // Check if newProject contains the equipe name
    return this.http.post<any>(`http://127.0.0.1:2000/users/${userId}/createProject`, newProject, { headers: this.headerUser });
  }

  getAllTicketsByProjetId(projectId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://127.0.0.1:2000/Tickets/${projectId}`, { headers: this.headerUser })

  }

  getOneTicketByProjetId(ticketId: string, projectId: string) {
    return this.http.get<any>(`http://127.0.0.1:2000/Ticket/${ticketId}/projet/${projectId}` , { headers: this.headerUser });
  }

  getOneUser(id: string): Observable<any> {
    return this.http.get<any>('http://127.0.0.1:2000/user/' + id,{headers:this.headerUser});
  }



  updateTicket(ticketId: string, projectId: string,  updatedTicket: any): Observable<any> {
    console.log('Updated Ticket:', updatedTicket);
    const userId = this.getUserIdFromToken();
    return this.http.put<any>(
      `http://127.0.0.1:2000/projet/user/${userId}/ticket/${ticketId}/updateTicket`,
      updatedTicket,
      { headers: this.headerUser }
    ).pipe(
      catchError((error) => {
        console.error('Error updating ticket:', error);
        throw error;
      })
    );
  }
  getUsersByEquipeId(equipeId: string) : Observable<any[]> {
    let userId = this.getUserIdFromToken();
    console.log('Requesting users for Equipe ID:', equipeId);
    return this.http.get<any[]>(`http://127.0.0.1:2000/user/${userId}/users/equipe/${equipeId}`, { headers: this.headerUser }).pipe(
      tap(users => console.log('Users received:', users)),
      catchError(error => {
        console.error('Error fetching users:', error);
        throw error;
      })
    );
  };


  getAllCommentsInTicket(ticketId: string): Observable<any[]> {
    console.log('Requesting commentaire for ticket ID:', ticketId);
    let userId = this.getUserIdFromToken();
    return this.http.get<any[]>(`http://127.0.0.1:2000/user/${userId}/ticket/${ticketId}/comments`, { headers: this.headerUser } ).pipe(
      catchError(error => {
        console.error('Error fetching comments:', error);
        throw error;
      })
    );
  }

  createTicket( ticketData: any): Observable<any> {
    let userId = this.getUserIdFromToken();

    return this.http.post<any>(`http://127.0.0.1:2000/projet/${ticketData.projetId}/user/${userId}/createTicket`,ticketData, { headers: this.headerUser } )
  }

  createCommentaire(ticketId: string, userId: string, commentaire: any): Observable<any> {
    return this.http.post<any>(`http://127.0.0.1:2000/ticket/${ticketId}/user/${userId}/comments`, { comment: commentaire }, { headers: this.headerUser } );
  }


  onDeleteTicket(id: string, userId: string) {

    return this.http.delete<any>(`http://127.0.0.1:2000/ticket/${id}/user/${userId}/deleteTicket`, { headers: this.headerUser });
  }

  onDeleteCommentaire(commentId: string, userId: string) {

    return this.http.delete<any>(`http://127.0.0.1:2000/comments/${commentId}/user/${userId}/deleteCommentaire`, { headers: this.headerUser });
  }

  onUpdateCommentaire(commentId: string, userId: string, updatedComment: any): Observable<any>{
    return this.http.put<any>(`http://127.0.0.1:2000/comments/${commentId}/user/${userId}/updateCommentaire`,updatedComment, { headers: this.headerUser })
  }




  }







