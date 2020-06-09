# Desafio Front End - Thiago Dipold Cavalcanti

## Objetivo

Construir uma consulta de CEP via API, retornando o endereço no Mapa, tratando as exceções inseridas pelo usuário.
O intuito é criar uma interface onde o fluxo de tela do usuário seja fluído e intuitivo em sua navegação, seguindo o design e as restrições indicadas pela empresa.

## Funcionalidades:

- A API de consulta de CEP usada é a viaCEP("https://viacep.com.br/);
- A API utilizada para disponibilizar o mapa através do CEP é a Google Maps Embed API;
- O usuário pode procurar diretamente o endereço/local que deseja através do CEP.
Caso ele não tenha essa informação, pode ser utilizado a função "Não sei meu CEP", onde deve ser inserido o estado (UF), cidade e Logradouro completo para retornar o CEP da rua.
- O usuário pode realizar quantas consultas desejar;
- A ferramenta possui ainda, um registrador(histórico) de CEPs buscados na mesma sessão.

