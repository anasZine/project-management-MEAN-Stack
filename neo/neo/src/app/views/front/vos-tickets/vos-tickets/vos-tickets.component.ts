import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { DataVosTicketsService } from '../../../services/data-vos-tickets.service';

@Component({
  selector: 'app-vos-tickets',
  templateUrl: './vos-tickets.component.html',
  styleUrl: './vos-tickets.component.scss'
})
export class VosTicketsComponent implements OnInit {
  projectId!: string;
  ticketId!: string;
  tickets: any[] = [];
  dataArray: any[] = [];
  currentTicket: any = {};
  i: any;
  updatedTicket: any = {};
  equipeUsers: any[] = [];
  commentaires: any[] = [];
  newTicket: any = {}
  selectedStatus: string = '';
  newComment: string = '';
  commentaire: string = '';



  constructor(private route: ActivatedRoute, private dataUserService: DataVosTicketsService) {
    this.fetchTicketsForProject(this.projectId);

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId = params['projectId'];
      this.fetchTicketsForProject(this.projectId);



    });

  }

  async fetchTicketsForProject(projectId: string) {
    this.dataUserService.getAllTicketsByProjetId(projectId).subscribe({
      next: (response: any[]) => {
        console.log('Project ID:', projectId);
        console.log('Tickets:', response);
        const userId = this.dataUserService.getUserIdFromToken(); // Get the current user's ID from AuthService
        console.log('userId',userId)
        const userTickets = response.filter(ticket => ticket.assigne_a === userId); // Filter tickets assigned to the current user
        console.log('yes',userTickets)
        this.arrangeTickets(userTickets);
      },
      error: (error: any) => {
        console.error('Error fetching tickets:', error);
      }
    });
  }

  setCurrentTicket(ticket: any) {
    this.currentTicket = ticket;
  }
  setNewTicketStatus(status: string) {
    this.newTicket.statut = status;
    console.log(status)
  }


  arrangeTickets(dataArray: any[]) {
    const statusClassMap: any = {
      'Non Commencé': 'card-title-custom1',
      'En Cours': 'card-title-custom2',
      'À Risque': 'card-title-custom3',
      'En Dépassement': 'card-title-custom4',
      'Complété': 'card-title-custom5'
    };

    this.tickets = [
      { title: 'Non Commencé', status: 'Non Commencé', data: dataArray.filter(ticket => ticket.statut === 'Non Commencé') },
      { title: 'En Cours', status: 'En Cours', data: dataArray.filter(ticket => ticket.statut === 'En Cours') },
      { title: 'À Risque', status: 'À Risque', data: dataArray.filter(ticket => ticket.statut === 'À Risque') },
      { title: 'En Dépassement', status: 'En Dépassement', data: dataArray.filter(ticket => ticket.statut === 'En Dépassement') },
      { title: 'Complété', status: 'Complété', data: dataArray.filter(ticket => ticket.statut === 'Complété') }
    ];

    this.tickets.forEach(ticket => {
      ticket.class = statusClassMap[ticket.status];
      console.log(`Title: ${ticket.title}, Status: ${ticket.status}, Class: ${ticket.class}`);
    });
  }

  logClass(className: string) {
    console.log('Class:', className);
  }



  async openTicketInfo(ticketId: string, projectId: string) {
    this.dataUserService.getOneTicketByProjetId(ticketId, projectId).subscribe({
      next: (response: any) => {
        console.log('Ticket details:', response);
        this.currentTicket = response;

        // Set current ticket details to updatedTicket
        this.updatedTicket = { ...this.currentTicket };

        // Make sure ticketId is defined
        if (!ticketId) {
          console.error('Ticket ID is undefined');
          return;
        }

        // Make sure projectId is defined
        if (!projectId) {
          console.error('Project ID is undefined');
          return;
        }

        // Fetch user details for rapporteur ID
        console.log('hathia hwa ', response.rapporteur)
        this.dataUserService.getOneUser(response.rapporteur).subscribe({
          next: (user: any) => {
            console.log('Rapporteur details:', user);
            // Set rapporteur name in updatedTicket
            this.updatedTicket.rapporteur = user._id;
            this.newTicket.rapporteur = user._id;
            this.currentTicket.rapporteurName = user.nom;
          },
          error: (error: any) => {
            console.error('Error fetching rapporteur details:', error);
          }
        });

        // Fetch user details for assigne_a ID
        this.dataUserService.getOneUser(response.assigne_a).subscribe({
          next: (user: any) => {
            console.log('Assigne_a details:', user);
            // Set assigne_a name in updatedTicket
            this.updatedTicket.assigne_a = user._id;
            this.newTicket.assigne_a = user._id;
            this.currentTicket.assigne_aName = user.nom;
            console.log(user.equipe_id)
            const equipe_Id = user.equipe_id;

            if (equipe_Id) {
              console.log('Equipe ID:', equipe_Id);
              // Fetch all users of a particular equipe
              this.dataUserService.getUsersByEquipeId(equipe_Id).subscribe({

                next: (users: any[]) => {
                  console.log('Equipe users:', users);
                  users.forEach(user => {
                    console.log(`User ID: ${user._id}, User Name: ${user.nom}`);
                  });
                  this.equipeUsers = users;
                },
                error: (error: any) => {
                  console.error('Error fetching equipe users:', error);
                }
              });

            }
          },

          error: (error: any) => {
            console.error('Error fetching assigne_a details:', error);
          }
        });

        // Fetch comments for the ticket


        this.getAllCommentsInTicket(ticketId);


      },
      error: (error: any) => {
        console.error('Error fetching ticket details:', error);
      }
    });
  }







  // Update Ticket Function

  updateTicket(ticketId: string, projectId: string, userId: string, updatedTicket: any): void {
    console.log('Updated Ticket:', updatedTicket);
    if (!ticketId) {
      console.error('Ticket ID is undefined');
      return;
    }
    console.log('User ID:', userId);
    if (!userId) {
      console.error('User ID is undefined');
      return;
    }
    console.log('Updated Tickett:', updatedTicket);
    console.log('Assignee IDD:', updatedTicket.assigne_a);
    if (!updatedTicket.assigne_a) {
      console.error('Assignee ID is undefined');
      return;
    }

    this.dataUserService.updateTicket(ticketId, projectId, updatedTicket).subscribe({
      next: (response: any) => {
        console.log('Ticket updated successfully:', response);
        // Reload tickets
        this.fetchTicketsForProject(projectId);
        location.reload();

      },
      error: (error: any) => {
        console.error('Error updating ticket:', error);
      }
    });

    if (updatedTicket.equipe_Id) {
      console.log('Equipe ID:', updatedTicket.equipe_Id);
      // Fetch all users of a particular team
      this.dataUserService.getUsersByEquipeId(updatedTicket.equipe_Id).subscribe({
        next: (users: any[]) => {
          console.log('Team users:', users);
          this.equipeUsers = users;
        },
        error: (error: any) => {
          console.error('Error fetching team users:', error);
        }
      });
    }

  }


  async getAllCommentsInTicket(ticketId: string) {
    console.log('Ticket ID:', ticketId);
    this.dataUserService.getAllCommentsInTicket(ticketId).subscribe({
      next: (comments: any[]) => {
        console.log('Comments:', comments);
        this.commentaires = comments || []; // Handling the case where comments are undefined
      },
      error: (error: any) => {
        console.error('Error fetching comments:', error);
      }
    });
  }

  // Create new ticket
  createNewTicket(newTicket: any) {
    if (!newTicket || !this.projectId) {
      console.error('Some required data is missing.');
      return;
    }
    let selectedStatus;
    const ticket = this.tickets.find(ticket => ['Non Commencé', 'En Cours', 'À Risque', 'En Dépassement', 'Complété'].includes(ticket.title));

    if (ticket) {
      selectedStatus = ticket.status;
    } else {
      selectedStatus = 'Non Commencé';
    }

    console.log('bes', selectedStatus)

    newTicket.projet_id = this.projectId;
    this.dataUserService.createTicket(newTicket).subscribe({
      next: (response: any) => {
        console.log('New ticket created successfully:', response);
        this.fetchTicketsForProject(this.projectId);


      },
      error: (error: any) => {
        console.error('Error creating new ticket:', error);
      }


    });
    let userId=this.dataUserService.getUserIdFromToken()
    this.dataUserService.getOneUser(userId).subscribe({
      next: (user: any) => {
        console.log('userId details:', user);
         this.newTicket.rapporteur = user._id;
            this.newTicket.assigne_a = user._id;

        console.log('hthia equipe',user.equipe_id)
        const equipe_Id = user.equipe_id;
        if (equipe_Id) {
          console.log('Equipe ID:', equipe_Id);
          // Fetch all users of a particular equipe
          this.dataUserService.getUsersByEquipeId(equipe_Id).subscribe({

            next: (users: any[]) => {
              console.log('Equipe users:', users);
              users.forEach(user => {
                console.log(`User ID: ${user._id}, User Name: ${user.nom}`);
              });
              this.equipeUsers = users;


            },
            error: (error: any) => {
              console.error('Error fetching equipe users:', error);
            }
          });

        }
      }

    });


  }



  addComment(ticketId:string,form: any): void {
    if (form.valid) {
      const userId = this.dataUserService.getUserIdFromToken();
      console.log(form.value.commentaire)
      this.dataUserService.createCommentaire(ticketId,userId,form.value.commentaire)
        .subscribe({
          next: (res: any) => {
          console.log(res)

            const modal = document.getElementById('addModal');
            if (modal) {
              modal.classList.remove('show');
              modal.setAttribute('aria-hidden', 'true');
              document.body.classList.remove('modal-open');

            }
        location.reload();

          },
          error: (error: HttpErrorResponse) => {
            console.error('Error adding equipe:', error);
            alert('Error adding equipe: ' + error.message);
          }
        });
    }
  }













  async openTicketInfoC(ticketId: string, projectId: string) {
    this.dataUserService.getOneTicketByProjetId(ticketId, projectId).subscribe({
      next: (response: any) => {
        console.log('Ticket details:', response);
        this.currentTicket = response;



        // Make sure ticketId is defined
        if (!ticketId) {
          console.error('Ticket ID is undefined');
          return;
        }

        // Make sure projectId is defined
        if (!projectId) {
          console.error('Project ID is undefined');
          return;
        }




      },
      error: (error: any) => {
        console.error('Error fetching ticket comment details:', error);
      }
    });
  }




  deleteTicket(ticketId:string): void {
    let userId=this.dataUserService.getUserIdFromToken()
    this.dataUserService.onDeleteTicket(ticketId,userId)
      .subscribe({
        next: (response: any) => {
          console.log('Ticket deleted successfully:', response);

          const modal = document.getElementById('deleteModal');
          if (modal) {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
          }
        location.reload();

        },
        error: (error: any) => {
          console.error('Error deleting ticket:', error);
        }
      });
  }



  deleteComment( commentId: string): void {
    let userId=this.dataUserService.getUserIdFromToken()
    this.dataUserService.onDeleteCommentaire(commentId, userId)
    .subscribe({
      next: (response: any) => {
        console.log('Commentaire deleted successfully:', response);
        location.reload();


      },
      error: (error: any) => {
        console.error('Error deleting Commentaire:', error);
      }
    });
  }


  // Function to toggle edit mode
toggleEdit(comment: any): void {
  comment.editMode = !comment.editMode;
  comment.updatedComment = comment.comment; // Initialize the updated comment
}

// Function to update the comment
updateComment(comment: any): void {
  const userId = this.dataUserService.getUserIdFromToken();
  this.dataUserService.onUpdateCommentaire(comment._id, userId, comment.updatedComment).subscribe({
    next: (response: any) => {
      console.log('Comment updated successfully:', response);
      comment.comment = comment.updatedComment; // Update the comment text
      comment.editMode = false; // Exit edit mode
    },
    error: (error: any) => {
      console.error('Error updating comment:', error);
    }
  });
}






}


































