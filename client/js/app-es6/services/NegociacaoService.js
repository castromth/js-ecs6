import {HttpService} from "./HttpService";
import {ConnectionFactory} from "./ConnectionFactory";
import {Negociacao} from "../models/Negociacao";
import {NegociacaoDao} from "../dao/NegociacaoDao";

export class NegociacaoService {

    constructor(){

        this.http = new HttpService();
    }
    cadastra(negociacao){
        return ConnectionFactory.getConnection()
          .then(connection => new NegociacaoDao(connection))
          .then(dao => dao.adiciona(negociacao))
          .then(() => "Negociacao adicionada com sucesso")
          .catch(error => {
              console.log(error)
              throw new Error("Nao foi possivel adicionar a negociacao")
          });
    }
    lista(){
        return ConnectionFactory
          .getConnection()
          .then(connection => new NegociacaoDao(connection))
          .then(dao => dao.listaTodos())
          .catch(error => {
              console.log(error);
              throw new Error("Nao foi possivel obter as negciacoes");
          });
    }
    apaga(){
        return ConnectionFactory
          .getConnection()
          .then(connection => new NegociacaoDao(connection))
          .then(dao => dao.apagaTodos())
          .then(() => "Negociacoes apagadas com sucesso")
          .catch(error => {
              console.log(error);
              throw new Error("Nao foi possivel apagar as negciacoes");
          });
    }
    importa(listaAtual){
        return this.obterNegociacoes()
                .then(negociacoes =>
                    negociacoes.filter(negociacao =>
                        !listaAtual.some(negociacaoExist =>
                            JSON.stringify(negociacao) == JSON.stringify(negociacaoExist))))
                .catch(error => {
                    console.log(error);
                    throw new Error("Nao foi possivel obter as Negociacoes");
                });
    }
    obterNegociacoes(){
        return Promise.all([
            this.obterNegociacoesDaSemana(),
            this.obterNegociacoesDaSemanaAnterior(),
            this.obterNegociacoesDaSemanaRetrasada()])
            .then(periodos =>{
                let negociacoes = periodos
                  .reduce((arrayAchatada,array) => arrayAchatada.concat(array),[])
                  .map( dado => new Negociacao(new Date(dado.data), dado.quantidade, dado.valor));
                  return negociacoes;
            }).catch(error => {
                throw new Error(error)
            });
    }

    obterNegociacoesDaSemana(){
        return new Promise((resolve, reject) => {
            this.http
            .get('negociacoes/semana')
            .then(negociacoes => {
                resolve(negociacoes
                    .map(objeto => new Negociacao(new Date(objeto.data),objeto.quantidade,objeto.valor)));
            }).catch(erro => {
                console.log(erro);
                reject("Nao foi possivel receber as negociacoes da semana !!");
            });
        });
    }
    obterNegociacoesDaSemanaAnterior(){
        return new Promise((resolve, reject) => {
            this.http
            .get('negociacoes/anterior')
            .then(negociacoes => {
                resolve(negociacoes
                    .map(objeto => new Negociacao(new Date(objeto.data),objeto.quantidade,objeto.valor)));
            }).catch(erro => {
                console.log(erro);
                reject("Nao foi possivel receber as negociacoes da semana anterior !!");
            });
        });
    }
    obterNegociacoesDaSemanaRetrasada(){
        return new Promise((resolve, reject) => {
            this.http
            .get('negociacoes/retrasada')
            .then(negociacoes => {
                resolve(negociacoes
                    .map(objeto => new Negociacao(new Date(objeto.data),objeto.quantidade,objeto.valor)));
            }).catch(erro => {
                console.log(erro);
                reject("Nao foi possivel receber as negociacoes da semana retrasada !!");
            });
        });
    }
}
