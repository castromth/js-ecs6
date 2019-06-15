import {Mensagem} from '../models/Mensagem';
import {Negociacao} from '../models/Negociacao';
import {ListaNegociacoes} from '../models/ListaNegociacoes';
import {NegociacoesView} from '../views/NegociacoesView';
import {MensagemView} from '../views/MensagemView';
import {NegociacaoService} from '../services/NegociacaoService';
import {DateHelper} from '../helpers/DateHelper';
import {Bind} from '../helpers/Bind';
class NegociacaoController {

    constructor(){

    let $ = document.querySelector.bind(document);
    this._inputQuantidade = $("#quantidade");
    this._inputData = $("#data");
    this._inputValor = $("#valor");
    this._ordemAtual = '';

    this._listaNegociacoes = new Bind(
        new ListaNegociacoes(),
        new NegociacoesView($("#negociacoesView")),
        "adiciona","esvazia","ordena","inverte");

    this._mensagem = new Bind(
        new Mensagem(),
        new MensagemView($("#mensagemView")),
        "texto");
    this._service = new NegociacaoService();
    this._init();
  }

  _init(){

      this._service
        .lista()
        .then(negociacoes =>
            negociacoes.forEach(negociacao =>
                this._listaNegociacoes.adiciona(negociacao)))
        .catch(error => this._mensagem.texto = error);

        setInterval(() => {
              this.importaNegociacoes();
          },3000)
  }
  btAdiciona(event){
      event.preventDefault();
      this._adiciona(this._criaNegociacao());
  }
  _adiciona(negociacao){
      this. _service
        .cadastra(negociacao)
        .then(mensagem => {
            this._mensagem.texto = mensagem;
            this._listaNegociacoes.adiciona(negociacao);
            this._limpaFormulario();
        }).catch(error => this._mensagem.texto = error);
  }

  apaga(event){

      this._service
        .apaga()
        .then(mensagem => {
            this._mensagem.texto = mensagem
            this._listaNegociacoes.esvazia();
        }).catch(error => this._mensagem.texto = error);

  }
  ordena(coluna){
      if(this._ordemAtual == coluna){
          this._listaNegociacoes.inverte();
      }else{
          this._listaNegociacoes.ordena((a, b) => a[coluna] - b[coluna]);
      }
      this._ordemAtual = coluna;
  }
  importaNegociacoes(){

     this. _service
        .importa(this._listaNegociacoes.negociacoes)
        .then(negociacoes =>
            negociacoes.forEach(negociacao =>
                this._adiciona(negociacao)))
        .catch(error => this._mensagem.texto = error);

  }
  _criaNegociacao(){
      return new Negociacao(
          DateHelper.textoParaData(this._inputData.value),
          this._inputQuantidade.value,
          this._inputValor.value);
  }
  _limpaFormulario() {
      this._inputData.value = "";
      this._inputQuantidade.value = "1";
      this._inputValor.value = "0.0";
      this._inputData.focus();
  }

}
let negociacaoController = new NegociacaoController();

export function currentInstance() {

    return negociacaoController;

}
