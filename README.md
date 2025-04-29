# Dentefier - Odontologia Forense 🦷 
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/felipperaia)

![GitHub stars](https://img.shields.io/github/stars/felipperaia/FinanFluency?style=for-the-badge&logo=starship&color=4CC417)
![GitHub issues](https://img.shields.io/github/issues/felipperaia/FinanFluency?style=for-the-badge&logo=visual-studio-code&color=2E74DF)
![GitHub license](https://img.shields.io/github/license/felipperaia/FinanFluency?style=for-the-badge&logo=creative-commons&color=EDED09)

Dentefier é uma aplicação web desenvolvida como parte do curso TADS035, focada em Odontologia Forense. O objetivo é fornecer uma plataforma para auxiliar profissionais na identificação odontológica em investigações forenses.

### 🚀 Funcionalidades Principais

Gerenciamento de Usuários: Controle de acesso baseado em funções (admin, perito, assistente).

Análise Odontológica: Ferramentas para análise e comparação de registros dentários.

Relatórios Detalhados: Geração de relatórios completos para uso em investigações.

---

## 🛠 Tecnologias Utilizadas

### Frontend
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Express.JS](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=fff&style=flat)
![JWT](https://img.shields.io/badge/JWT-black?style=plastic&logo=JSON%20web%20tokens)
![Bcrypt](https://img.shields.io/badge/Bcrypt-%E2%9C%94-blueviolet)

### Others
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat&logo=github-actions&logoColor=white)
![Vscode](https://img.shields.io/badge/Vscode-007ACC?style=flatfor-the-badge&logo=visual-studio-code&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37.svg?style=flat&logo=Postman&logoColor=white)

---

## Passos para Configuração:

1º Clone o repositório:

```bash 
    git clone https://github.com/felipperaia/Dentefier-Odontologia-Forense.git
```

2º Configure o Back-end:
```bash
    cd Dentefier-Odontologia-Forense/Backend
    npm install
```
3º Crie um arquivo .env na pasta Backend com as seguintes variáveis:

JWT_SECRET=sua_chave_secreta_jwt

4º Inicie o servidor:
```bash
    npm run start
```

---

### 🔑 Criação de Usuário via Postman

Para criar um novo usuário, siga os passos:

Endpoint: POST http://localhost:3000/api/auth/register

Headers:
Key           |   Key
Authorization | SEU_TOKEN_JWT

Body:
raw
JSON


{
  "username": "admin",
  "password": "admin123456",
  "role": "admin"
}

---

### Observações: 

Password deve ter no mínimo 8 caracteres.

"role" deve ser um dos seguintes: admin, perito, assistente.

Resposta Esperada:

json


{
    "message": "Usuário registrado com sucesso"
}

---

### 🛡️ Autenticação e Autorização
A aplicação utiliza JWT para autenticação. Após o login bem-sucedido, um token é fornecido e deve ser incluído no header Authorization como Bearer SEU_TOKEN_JWT em requisições subsequentes para acessar rotas protegidas.

---

### 📈 Atualizações Futuras

Estamos continuamente trabalhando para melhorar o Dentefier. Algumas das próximas atualizações incluem:

Integração com IA para análise preditiva.

Suporte multilíngue.

Aplicativo móvel complementar.

---

### 🤝 Contribuições
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests. Por favor, siga as diretrizes de contribuição e código de conduta.
---

### 📄 Licença
Este projeto está licenciado sob a MIT License.

