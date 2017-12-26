import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, Searchbar, ViewController, AlertController } from 'ionic-angular';

declare var google;


@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {

 segments: string = "recife";

  @ViewChild('map') mapElement: ElementRef; //Acessa o elemento 'map' do DOM e declara do tipo ElementRef
  @ViewChild('searchbar') searchbar: Searchbar; //Acessa o elemento 'searchbar' do DOM e declara do tipo Searchbar
  private start = ''; //Declaração da variável start
  private end = ''; //Declaração da variável end
  private autocompleteItems: any; //Declaração da variável 'autocompleteItems'
  private autocomplete: any; //Declaração da variável 'autocomplete'
  private acService: any; //Declaração da variável 'acService'
  private nameLocal = 'Selecione o local';//Declaração da variável 'nameLocal
  private statusLocal = false;//Declaração da variável 'statusLocal
  private locaisRecife: any[];//Declaração da variável 'locaisRecife'
  private locaisPetrolina: any[];//Declaração da variável 'locaisPetrolina'
  private locaisCaruaru: any[];//Declaração da variável 'locaisCaruaru'

  constructor(

    public navCtrl: NavController,
    public viewCtrl: ViewController,
    private zone: NgZone,
    private alertCtrl: AlertController,

  ) {

        this.acService = new google.maps.places.AutocompleteService(); //Inicializa com a funcionalidade do autocomplete places do Google Maps API 
        this.autocompleteItems = []; //Inicializa a variável como um vetor vazio
        this.autocomplete = { //Inicializa a variável com o atributo 'query'

            query: ''

        };

        //Inicializa a variável como um vetor com os lacais Fundaj Casa Forte
        this.locaisRecife = [

           {name: 'Universidade Federal de Pernambuco', value: 'Av. Prof. Moraes Rego, 1235 - Cidade Universitária, Recife - PE, 50670-901'},
           {name: 'Universidade Federal Rural de Pernambuco', value: 'R. Manuel de Medeiros, s/n - Dois Irmãos, Recife - PE, 52171-900'},
           {name: 'Instituto Federal de Pernambuco', value: 'Rua Edson Barbosa de Araújo, s/n, Bairro Manoela Valadares 56800-000, Afogados da Ingazeira - PE, 56800-000'}

        ]

        //Inicializa a variável como um vetor com os locais Fundaj Apipucos
        this.locaisPetrolina = [

          {name: 'Universidade Federal do Vale do São Francisco', value: 'Av. José de Sá Maniçoba, s/n - Centro, Petrolina - PE, 56304-917'},
          {name: 'Instituto Federal do Sertão Pernambuco', value: 'R. Cel. Amorim, 76 - Centro, Petrolina - PE, 56302-320'}

        ]

        //Inicializa a variável como um vetor com os locais Fundaj Derby
        this.locaisCaruaru = [

           {name: 'Universidade Federal de Pernambuco - Caruaru', value: 'Rodovia BR-104, Km 59, s/n - Nova Caruaru, Caruaru - PE, 55002-970'}

        ]

  }

  //Método que pega o local de destino selecionado
  selecionarLocal(local: any) {

      this.nameLocal = local.name;
      console.log(this.nameLocal);
      this.end = local.value;
      console.log(this.end);
      this.statusLocal = !this.statusLocal;

      let data = { origem: this.start, destino: this.end };
      this.viewCtrl.dismiss(data);

  }

  //Método que fecha o modalMap
  dismiss() {

    this.viewCtrl.dismiss();

  }

  //Método que muda o status da variável 'statusLocal'
  mudarStatus() {

      this.statusLocal = !this.statusLocal;

  }

  //Método que pega o local de origem selecionado
  chooseItem(item: any) {

      console.log('modal > chooseItem > item > ', item.description); //Exibe no console o lugar selecionado

      this.searchbar.setValue(item.description); //Insere na tag <ion-searchbar></ion-searchbar> o lugar selecionado

      this.autocompleteItems = []; //Reinicializa o vetor autocompleteItems;

      this.start = item.description; //A variável 'start' recebe o lugar selecionado

      console.log(item.description); //Exibe no console o lugar selecionado

  }

  //Método que atualiza as sugestões dos locais
  updateSearch() {

      console.log('modal > updatesearch'); //Exibe no console a informação

      //Verifica se a pesquisa é válida
      if(this.autocomplete.query == '') {

          this.autocompleteItems = []; //Vetor vazio

          return;

      }

      let self = this;


      this.acService.getPlacePredictions({ input: this.autocomplete.query }, (predictions, status) => {

          console.log('modal > getPlacePredictions > status > ', status); //Exibe no console o valor do status

          self.autocompleteItems = [];//Recebe um vetor vazio
          
          console.log(predictions); //Exibe no console o valor de predictions

          this.zone.run(() => {

              if(predictions == null) {

                 let alert = this.alertCtrl.create({

                    title: 'Endereço inválido',
                    subTitle: 'Por favor, tente novamente!',
                    buttons: ['OK']

                  });

                  alert.present();

              } else {

                        predictions.forEach((prediction) => {

                                 this.autocompleteItems.push(prediction);
                            

                          
                    
                    });

            }      

        });

    });

}

  ionViewDidLoad() {
    
  }


}
