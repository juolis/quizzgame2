import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdMob, AdOptions, BannerAdOptions, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  questions:any = [];
  wrongAnswer:any = [];
  questiontitle:any;
  questionAnswer:any;
  helpAnswer:any;
  formSendAnswer:FormGroup
  questionNumber:any;
  questionsLength: any;

  constructor(private serviceApi:ApiService,
    public formBuilder:FormBuilder,
    public alertController:AlertController,
    private router: Router) {
      this.formSendAnswer = this.formBuilder.group({
        answer:["",Validators.required],
      });
       
     }

  ngOnInit() {
   AdMob.initialize({
    requestTrackingAuthorization:true,
    testingDevices:[''],
    initializeForTesting:true,
   });
   this.showBanner();
  }
  ionViewWillEnter(){
    this.questionNumber = localStorage.getItem("questionNumber");
    if(!this.questionNumber){
      this.questionNumber = 0;
    }
    this.getQuestions();
    this.getWrongAnswers();
  }

  getQuestions(){
    this.serviceApi.getQuestions().subscribe(
      (res)=>{
        this.questions= res;
        this.questionsLength = this.questions.length;
        console.log("Cantidad de preguntas:",this.questionsLength)
        this.questiontitle = this.questions[this.questionNumber].question;
        this.questionAnswer = this.questions[this.questionNumber].answer;
        this.helpAnswer = this.questions[this.questionNumber].help;
        console.log("preguntas:",this.questions)
        if(!this.questiontitle)
        this.presentAlertWin();
      },(err)=>{
        console.log("error:",err)
      }
    )
  }
  getWrongAnswers(){
    this.serviceApi.getWrongAnswers().subscribe(
      (res)=>{
        this.wrongAnswer= res;
        console.log("wrongAnswers:",this.wrongAnswer)
      },(err)=>{
        console.log("error:",err)
      }
    )
  }
  sendAnswer(){
    let value = this.formSendAnswer.value;
    console.log("Respuesta enviada",value)
    if(value.answer == this.questionAnswer){
      console.log("Respuesta correcta",value)
      this.presentAlertCorrectAnswer();
    }else{
      console.log("Respuesta incorrecta")
      this.presentAlertWrongAnswer()
    }
  }
  
  nextLevelButton(){
    if(this.questionNumber<this.questionsLength){
     this.questionNumber  = ++this.questionNumber;
     localStorage.setItem("questionNumber",this.questionNumber)
     this.getQuestions();
    }else{
      this.presentAlertWin();
    }
  }
  heltp(){
    this.showAdsInterstitial(); 
    this.presentAlertHelp();

  }
  getRandomInt(min: number,max: number){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random()*(max-min+1))+min;
  }
  async showAdsInterstitial(){
    const options:AdOptions={
      adId: '',
      isTesting:true,
    };
    await AdMob.prepareInterstitial(options);
    await AdMob.showInterstitial();
  }
  async showBanner(){
    const options:BannerAdOptions={
      adId: '',
      isTesting:true,
      adSize:BannerAdSize.ADAPTIVE_BANNER,
      position:BannerAdPosition.BOTTOM_CENTER,
      margin:100,
    };
    await AdMob.showBanner(options);
  }

  async presentAlertCorrectAnswer(){
    const alert = await this.alertController.create({
      header:"Respuesta correcta",
      message:"Bueno, veremos si puedes con la siguiente...",
      buttons: ["OK"]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    this.nextLevelButton(); 
  }
  async presentAlertWrongAnswer(){
    const alert = await this.alertController.create({
      header:"Respuesta incorrecta",
      message:this.wrongAnswer[this.getRandomInt(0,14)].answer,
      buttons: ["OK"]
    });
    await alert.present();
    let result = await alert.onDidDismiss(); 
  }
  async presentAlertHelp(){
    const alert = await this.alertController.create({
      header:"ayuda",
      message: this.helpAnswer,
      buttons: ["OK"]
    });
    await alert.present();
    let result = await alert.onDidDismiss(); 
  }

  async presentAlertWin(){
    const alert = await this.alertController.create({
      header:"Lo consegiste",
      message: "Parecía que no , pero por fin has conseguido pasarte el juego,supongo que te habrán ayudado",
      buttons: ["OK"]
    });
    await alert.present();
    let result = await alert.onDidDismiss(); 
    this.router.navigate(["/game"]);
  }


  

}
