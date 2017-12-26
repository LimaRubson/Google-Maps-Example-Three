import { Component, ViewChild, ElementRef, NgZone  } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar, AlertController, ModalController, ViewController } from 'ionic-angular';

import { ModalPage } from './../modal/modal';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
@ViewChild('map') mapElement: ElementRef; //Acessa o elemento 'map' do DOM e declara do tipo ElementRef
  private map: any; //Declaração da variável map 
  private directionsService = new google.maps.DirectionsService; //Objeto se comunica com serviço Directions da Google Maps API, que recebe solicitações de rotas e retorna resultados calculados
  private directionsDisplay = new google.maps.DirectionsRenderer; //Renderiza os resultados das rotas calculadas do 'DirectionsService'
  private start = ''; //Declaração da variável start
  private end = ''; //Declaração da variável end

  constructor(
    public navCtrl: NavController,
    private zone: NgZone,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {
  }

  //Método que cria o mapa
  initMap() { // este código inicializa o mapa no local desejado

    this.map = new google.maps.Map(this.mapElement.nativeElement, {

      zoom: 15,
      center: {lat: -8.0578381, lng: -34.8828969 } // latitude e longitudo

    });

    this.directionsDisplay.setMap(this.map);

  }
  

  //Método que abre o modalMap
  openModalMap() {

      let mapModal = this.modalCtrl.create(ModalPage);
      mapModal.onDidDismiss(data => {

        try {

            this.start = data.origem;

            console.log(this.start);

            this.end = data.destino;

            console.log(this.end);

            this.directionsService.route({

                 origin: this.start, // pega a origem
                 destination: this.end, //pega o destino
                 travelMode: 'DRIVING'

            }, (response, status) => {

                    if (status === 'OK') {

                          this.directionsDisplay.setDirections(response); // se ocorrer tudo bem

                    } else {

                          let alert = this.alertCtrl.create({

                                title: 'Rota indisponível',
                                buttons: ['OK']

                          });

                          alert.present();
                          
                    }

                });

          } catch (undefined) {

              let alert = this.alertCtrl.create({

                    title: 'Nenhuma rota selecionada',
                    subTitle: 'Por favor, tente novamente!',
                    buttons: ['OK']

             });

             alert.present();

        }
    });

     mapModal.present();
            

}

  autoOpenModalMap() {

    setTimeout(() => this.openModalMap(), 2000);
    
  }

  //Método que calcula a rota 
  calculateAndDisplayRoute() { // este código calcula a distância inicial e final

        this.directionsService.route({

            origin: this.start, // pega a origem
            destination: this.end, //pega o destino
            travelMode: 'DRIVING'

        }, (response, status) => {

            if (status === 'OK') {

                    this.directionsDisplay.setDirections(response); // se ocorrer tudo bem

            } else {

                  let alert = this.alertCtrl.create({

                          title: 'Rota inválida',
                          subTitle: 'Por favor, rota indisponível!',
                          buttons: ['OK']

                    });

                alert.present();
                          
            }

       });

    }

  
  ionViewDidLoad() {
    
       this.initMap();
       this.autoOpenModalMap();//Chama o método que inicializa o mapa

  }


}
