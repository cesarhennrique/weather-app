# 🌦️ Weather App – Previsão do Tempo

Aplicativo simples de previsão do tempo desenvolvido em **JavaScript**, utilizando a **API Open-Meteo**.  
O projeto permite que o usuário informe o nome de uma cidade e obtenha dados climáticos atuais, como **temperatura**, **velocidade do vento** e **umidade**, diretamente pelo terminal ou integrado a outros sistemas.

---

## 📌 Visão Geral do Projeto

Este projeto foi criado com foco em **aprendizado e boas práticas para desenvolvedores iniciantes**, abordando:

- Consumo de APIs REST com **Fetch API**
- Uso de **async/await**
- Tratamento de erros (entrada inválida, falhas de API e rede)
- Organização de código
- Registro de respostas em arquivo para fins de log

A API utilizada (**Open-Meteo**) é gratuita e não exige chave de autenticação.

---

## 🛠️ Tecnologias Utilizadas

- JavaScript (ES6+)
- Node.js (versão 18 ou superior)
- Fetch API (nativa do Node)
- Open-Meteo API (Geocoding + Weather)

---

## 📦 Instalação

### Pré-requisitos
- Node.js **18 ou superior**
- Git (opcional)

### Passo a passo

1. Clone o repositório (ou baixe o projeto):
   ```bash
   git clone https://github.com/seu-usuario/weather-app.git
Acesse a pasta do projeto:

cd weather-app
Execute o aplicativo:

node main.js
⚠️ Não é necessário instalar dependências externas.

▶️ Guia de Uso
Abra o arquivo main.js

Informe o nome da cidade desejada no ponto de entrada do código

Execute o script com:

node main.js
O resultado será exibido no terminal

As respostas também serão registradas em um arquivo de log (caso habilitado)

📊 Exemplo de Resultado
{
  "city": "Recife (BR)",
  "temperatureC": 28.4,
  "windSpeed": 12.3,
  "humidity": 72,
  "description": "Parcialmente nublado"
}
Em caso de erro:

{
  "error": true,
  "message": "Cidade não encontrada. Verifique o nome e tente novamente."
}
✅ Funcionalidades
🔍 Busca de cidade por nome

📍 Conversão de cidade em latitude e longitude (Geocoding)

🌡️ Consulta de temperatura atual (°C)

💨 Consulta de velocidade do vento

💧 Consulta de umidade

❌ Tratamento de erros:

Nome de cidade inválido

Cidade não encontrada

Falhas de API

Problemas de rede

📝 Registro de respostas em arquivo (log)

📦 Retorno de dados em formato JSON

🚀 Possíveis Melhorias Futuras
Interface gráfica com HTML e CSS

Entrada de dados via formulário

Exibição em cards visuais

Ícones climáticos dinâmicos

Previsão para próximos dias

Seleção de unidades (°C / °F)

Histórico de cidades pesquisadas

Integração com frontend (React, Vue, etc.)

Testes automatizados

Uso de variáveis de ambiente

📄 Licença
Este projeto é livre para uso educacional e pessoal.

🤝 Contribuição
Sugestões e melhorias são bem-vindas!
Sinta-se à vontade para abrir issues ou pull requests.

Desenvolvido para fins de estudo e prática 🚀