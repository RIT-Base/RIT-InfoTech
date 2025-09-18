(() => {
    const terminal = document.getElementById('terminal');
    const input = document.getElementById('cmdInput');

    const fileContents = {
    'README.txt': 'files/README.txt',
    'notes.log': 'files/notes.log',
    'secret.enc': 'files/secret.enc'
    };

    const commands = {
        help: 'Available commands: help, ls, echo, clear, cat',
        ls: 'README.txt  notes.log  secret.enc',
        clear: () => terminal.innerHTML = '',
        echo: args => args.join(' '),
        cat: async (args) => {
            const filename = args[0];
            if (filename in fileContents) {
                try {
                    const response = await fetch(fileContents[filename]);
                    if (!response.ok) {
                        return `cat: ${filename}: error reading file`;
                    }
                    return await response.text();
                } catch (err) {
                    return `cat: ${filename}: ${err.message}`;
                }
            } else {
                return `cat: ${filename}: No such file or directory`;
            }
        }
    };

    input.addEventListener('keydown', async e => {
    if (e.key === 'Enter') {
        const text = input.value.trim();
        terminal.innerHTML += `<div>> ${text}</div>`;
        input.value = '';

        const [cmd, ...args] = text.split(' ');

        if (commands[cmd]) {
            let output;
            if (typeof commands[cmd] === 'function') {
                // await in case the function returns a Promise (like fetch)
                output = await commands[cmd](args);
            } else {
                output = commands[cmd];
            }
            if (output) {
                terminal.innerHTML += `<div>${output.replace(/\n/g, '<br>')}</div>`;
            }
        } else {
            terminal.innerHTML += `<div>Command not found</div>`;
        }

        terminal.scrollTop = terminal.scrollHeight;
    }});
})();
