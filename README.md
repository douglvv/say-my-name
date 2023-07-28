# say-my-name

<!---Esses são exemplos. Veja https://shields.io para outras pessoas ou para personalizar este conjunto de escudos. Você pode querer incluir dependências, status do projeto e informações de licença aqui--->

> Jogo 1v1 desenvolvido utilizando Node.js, React, Socket.io e a API Breaking Bad Quotes. Em cada turno uma frase aleatória da série sera gerada e o jogador deverá escolher entre 4 alternativas qual personagem disse a frase. Ao fim de 10 rodadas, o jogador com mais acertos vence.
> 
> 1v1 game developes using Node.js, React, Socket.io e the Breaking Bad Quotes API. In each turn, a random quote from the series will be generatet and the player must choose between 4 alternativas wich caracther said the quote. By the end of 10 rounds, the player wich more correct guesses wins.


## 💻 Pré-requisitos:

* Node.js.
* React.
* Socket.io

## ☕ Instalação:
Terminal:
```
cd <Pasta de instalação>
```
```
git clone https://github.com/douglvv/say-my-name.git
```
```
cd say-my-name
```
```
npm install
```
```
cd server
```
```
npm install
```
```
npm start
```
Em outro terminal
In another terminal
```
cd client
```
```
npm install
```
```
npm run dev
```

A partir deste ponto a aplicação estará rodando na porta padrão do React.
Talvez seja necessário alterar em server/index.js, na linha 12, onde é instanciado o servidor io, no cors, o endereço de origem das requições do cliente para a url onde o app react está rodando.

By this point the app will be running in React's default port.
Maybe it will be necessary  to alter in server/index.js, in line 12, on cores, the client's requisitions origin to the url where the react app is running.
<br>
[⬆ Voltar ao topo](#say-my-name)<br>
