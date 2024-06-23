import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthadminService } from '../../views/services/authadmin.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent implements OnInit {
  forgetForm !:FormGroup
  fb=inject(FormBuilder);
  authService=inject(AuthadminService)

  ngOnInit(): void {
      this.forgetForm=this.fb.group({
        email:['',Validators.compose([Validators.required,Validators.email])]
      })
  }

  submit(){
    this.authService.sendEmail(this.forgetForm.value.email)
    .subscribe({
      next:(res)=>{
        alert(res.message)
        this.forgetForm.reset()
      },
      error:(err)=>{
        alert(err.error.message)
      }
    })

  }

}
