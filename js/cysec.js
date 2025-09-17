(() => {
    const terminal = document.getElementById('terminal');
    const input = document.getElementById('cmdInput');

    const commands = {
        help: 'Available commands: help, ls, echo, clear',
        ls: 'file1.txt  file2.txt',
        clear: () => terminal.innerHTML = '',
        echo: args => args.join(' ')
    };

    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            const text = input.value.trim();
            terminal.innerHTML += `<div>> ${text}</div>`;
            input.value = '';

            const [cmd, ...args] = text.split(' ');
            if (commands[cmd]) {
                const output = typeof commands[cmd] === 'function' ? commands[cmd](args) : commands[cmd];
                if (output) terminal.innerHTML += `<div>${output}</div>`;
            } else {
                terminal.innerHTML += `<div>Command not found</div>`;
            }

            terminal.scrollTop = terminal.scrollHeight;
        }
    });
})();
