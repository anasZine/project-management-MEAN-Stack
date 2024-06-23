import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { AuthadminService } from '../../views/services/authadmin.service';

@Component({
  selector: 'app-rforget',
  templateUrl: './rforget.component.html',
  styleUrl: './rforget.component.scss'
})
export class RforgetComponent implements OnInit {
  resetForm!:FormGroup;
  fb=inject(FormBuilder)
  authService=inject(AuthadminService)

  activateRoute=inject(ActivatedRoute)
  router=inject(Router)
  token!:string
  password!:string
  reset(){
    let resetObj={
      token:this.token,

      password:this.resetForm.value.password
    }
    this.authService.resetPassword(resetObj.token,resetObj.password)
    .subscribe({
      next:(res)=>{
        alert(res.message)
        this.resetForm.reset()
        this.router.navigate(["admin/login"])
      },
      error:(err)=>{
        alert(err.error.message)
      }
    })
  }
  ngOnInit(): void {
    this.resetForm=this.fb.group({
      password:['',Validators.required],
      confirmPassword:['',Validators.required]

    },


  )
    this.activateRoute.params.subscribe(val=>{
      this.token=val['token']
      console.log(this.token)
    })

  }

}
function confirmPasswordValidator(): any {
  throw new Error('Function not implemented.');
}

