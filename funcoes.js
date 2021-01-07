$(document).ready(() => {
    //Default
    $('#Form-login, #btn_realcad, #btn_entrar').show()
    $('#Form-cadastro, #btn_cad, #btn_reset').hide()

    //Botão Realizar Cadastro
    $('#btn_realcad').on('click', function(){

        $('#Form-login, #Cadastro-pag2, #btn_realcad, #btn_entrar').hide()
        $('#btn_cad, #btn_reset, #Form-cadastro, #Cadastro-pag1, #Conteudo-footer').show()

        $('#Conteudo-titulo').html('CADASTRAR - Usuário')
        
        $('#Principal-conteudo').animate({'height': '80%'})
        $('#Conteudo-conteudo').animate({'height' : '65%'})
    })

    //Botão Prev/Prox
    $('#btn_prev').on('click', function(){
        $('#Conteudo-titulo').html('CADASTRAR - Usuário')
        $('#Cadastro-pag2').hide()
        $('#Cadastro-pag1, #btn_prox').show()
    })
    $('#btn_prox').on('click', function(){
        $('#Conteudo-titulo').html('CADASTRAR - Veículo')
        $('#Cadastro-pag2, #btn_prev').show()
        $('#Cadastro-pag1').hide()
    })

    //Mascara para Cpf's
    $("#login_cpf, #cad_cpf").mask('000.000.000-00', {reverse: true})

    //Botao Cadastrar
    $('#btn_cad').on('click', function(){
        
        let veic = new Veiculo({
            'placa': $('#cad_placa').val(),
            'renavam': $('#cad_renavam').val(),
            'modelo': $('#cad_modelo').val(),
            'marca': $('#cad_marca').val(),
            'ano': $('#cad_ano').val()
        })

        if(veic.aut_veic()){
            console.log("Aceito")
            console.log(veic)
            
            let usuario = new Usuario({
                'cpf': $('#cad_cpf').val(),
                'nome': $('#cad_nome').val(),
                'email': $('#cad_email').val(),
                'senha': $('#cad_senha').val(),
                'veiculo': veic
            })
            if(usuario.aut_user()){
                console.log("Funciona")
                console.log(usuario)

                let conexao = new ConexStorage()
                conexao.gravar(usuario)


            }
            else{
                console.log("Erro ao Cadastrar Usuário")
                console.log(usuario)
            }
        }
        else{
            console.log("Erro ao cadastrar Veiculo")
            console.log(veic)
        }
    })
    
    $('#btn_entrar').on('click', function(){
        
        $('#login_senha')
        
        let conexao = new ConexStorage()
        conexao.efetuar_login($('#login_cpf').val(), $('#login_senha').val())

    })
})

// ------------------------ CLASSE VEÍCULO ----------------------------- //

class Veiculo{

    constructor(obj){
        this.placa = obj['placa']
        this.renavam = obj['renavam']
        this.modelo = obj['modelo']
        this.marca = obj['marca']
        this.ano = obj['ano']
    }

    aut_veic(){
        let aut_placa = new RegExp('^[a-zA-Z]{3}[-]?[0-9]{4}$')
        let aut_ano = new RegExp('^[0-9]{4}$')
        
        // Autenticações futuras devem ser chamadas nesse ambiente através do boolean do if
        if( aut_placa.test(this.placa) && 
            aut_ano.test(this.ano) && 
            this.renavam != '' &&
            this.modelo != '' &&
            this.marca != ''
            ){
            return true
        }
        else{   return false    }

            //let user_veiculo = { 'placa' : this.placa, 'renavam' : this.renavam, 'modelo' : this.modelo, 'marca' : this.marca, 'ano' : this.ano  }
            //return user_veiculo 
    }

}

// ------------------------ CLASSE USUÁRIO ----------------------------- //

class Usuario{

    constructor(obj){
        this.cpf = obj['cpf']
        this.nome = obj['nome']
        this.email = obj['email']
        this.senha = obj['senha']
        this.veiculo = obj['veiculo']
    }
    
    aut_user(){
        
        // Autenticações futuras devem ser chamadas nesse ambiente através do boolean do if
        if( ValidarCPF(this.cpf) && 
            this.nome != '' && 
            this.email != '' &&
            this.senha != ''
            ){
            return true
        }
        else{
            return false
        }
    }

}

// ------------------------ CLASSE CONEXÃO ----------------------------- //

class ConexStorage{
    
    gravar(usuario) {
        
        if(localStorage.getItem(usuario['cpf']) === undefined || localStorage.getItem(usuario['cpf']) === null){
            
            // Conferir se é necessario manter a conversão
            localStorage.setItem(usuario['cpf'], JSON.stringify(usuario))
        
            alert("Usuário "+ usuario['nome'] + " Gravado com Sucesso")
            window.location.href='./index.html'
        }
        else{
            alert("-- Não foi Possível realizar a Gravação -- CPF ja esta Cadastrado")
        }

    }
    consultar(cpf){
        
        let obj = JSON.parse(localStorage.getItem(cpf))

        if(obj){ return obj }
        else{  return false }
    }

    efetuar_login(cpf, senha){
        this.cpf = cpf
        this.senha = senha
        let conf = this.consultar(this.cpf)
        if(conf != undefined || conf != ''){
            if(this.cpf == conf['cpf'] && this.senha == conf['senha']){
                alert("Login Efetuado com Sucesso")
                console.log(conf)
            }
            else{
                alert("Senha e/ou CPF incorretos")
            }
        }
        else{
            alert("Erro")
        }

    }
    
}

// ----------------------- VALIDAÇÃO DE CPF ----------------------------//

function ValidarCPF(cpf){
        
    let vcpf = cpf
    let soma = 0
    let resto = 0
    let i = 0
    
    vcpf = vcpf.replace('.', '').replace('.', '').replace('-', '')

    if(vcpf.length != 11){  return false    }
    else{
        for (i = 1; i <= 9; i++) {
            soma += parseInt(vcpf.substring(i - 1, i)) * (11 - i)
        }
        resto = 11 - (soma % 11);
        if(resto == 11){resto = 0}

        if(resto != vcpf[9]){ return false    }
        else{
            resto = 0
            soma = 0

            for (i = 1; i <= 10; i++) {
                soma += parseInt(vcpf.substring(i - 1, i)) * (12 - i)
                
            }
            resto = 11 - (soma % 11);
            if(resto == 11){resto = 0}
           
            if(resto == vcpf[10]){
                return true }
            else{   return false    }
        }
    }
}

