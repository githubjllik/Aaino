const fs = require('fs');
const path = require('path');

const routes = {
    'home': 'index.html',
    'social-media': 'pg2.html',
    'streaming': 'pg3.html',
    'learn': 'pg4.html',
    'ai': 'pg5.html',
    'edit': 'pg6.html',
    'develop': 'pg7.html',
    'e-services': 'pg8.html',
    'explore': 'pg9.html',
    'download': 'pg10.html',
    'devices': 'pg11.html',
    'search': 'pg12.html',
    'darkweb': 'pg13.html',
    'discover': 'pg14.html',
    'about': 'pg15.html',
    'new': 'nouveaux.html',
    'search-results': 'search-results.html'
};

Object.entries(routes).forEach(([route, target]) => {
    const content = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0;url=/${target}">
    <script>window.location.href = '/${target}';</script>
</head>
<body>
    <p>Redirection vers la page...</p>
</body>
</html>`;

    fs.mkdirSync(route, { recursive: true });
    fs.writeFileSync(path.join(route, 'index.html'), content);
});
