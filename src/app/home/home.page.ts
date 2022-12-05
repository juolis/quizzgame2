import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor( public router:Router,
    public alertController:AlertController) {}

  start(){
    this.presentAlertStart();
  }

  continue(){
   this.router.navigate(["/game"]);
  }
  formQuizz(){
    window.open("https://www.randyvarela.es/quizzappform/",'_system','location=yes');
  }

  async presentAlertStart(){
    const alert = await this.alertController.create({
      header:"¿Deseas comenzar de 0?",
      message:"¿Estás seguro que deseas comenzar de 0?Todo tu progreso se perdera",
      buttons: [{
        text:"SI",
        handler:()=>{
          localStorage.setItem("questionNumber","0");
          this.router.navigate(["/game"]);
        }
      },
      {
        text:"NO",
        handler:()=>{
        }
      }
    ]
    });
    await alert.present();
    let result = await alert.onDidDismiss(); 
  }  

}
