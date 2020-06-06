const mailTemplate = ({
  text,
  link,
  button,
}: {
  text: string
  link: string
  button: string
}): string => {
  return `
    <style>
    .main {
      background: #8c5c43;
      padding: 10px;
      font-family: sans-serif;
      color: #fff;
    }
  
    .template {
      background: #43241a;
      border-radius: 10px;
      padding: 10px;
    }
  
    .body {
      text-align: center;
      padding: 5px 0;
    }
  
    a {
      text-decoration: none;
      color: #fff;
      padding: 5px 10px;
      background: #8c5c43;
      display: inline-block;
      margin-top: 10px;
    }
  
    .logo {
      text-align: center;
      font-weight: 700;
      color: #fff;
      letter-spacing: 3px;
      margin-bottom: 5px;
      padding-bottom: 5px;
      border-bottom: 4px solid #8c5c43;
    }
    
    .footer {
      text-align: center;
      font-size: 13px;
      padding: 5px;
    }
  
  </style>
  
  <div class="main">
    <div class="template">
      <div class="logo">BLOGEJST</div>
      <div class="body">
        <div class="header">${text}</div>
        <a href="${link}">${button}</a>
      </div>
    </div>
  
    <div class="footer">
      Roshan Acharya - BLOGEJST
    </div>
  </div>
  
    `
}

export default mailTemplate
