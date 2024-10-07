// helpers/consoleSuppressor.ts
export const suppressConsole = (suppress, isDev, suppressInDev, suppressInProd) => {
    const originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        debug: console.debug,
        info: console.info,
    };
    const shouldSuppress = isDev ? suppressInDev : suppressInProd;
    if (shouldSuppress) {
        suppress.forEach((type) => {
            switch (type) {
                case "log":
                    console.log = () => { };
                    break;
                case "warn":
                    console.warn = () => { };
                    break;
                case "error":
                    console.error = () => { };
                    break;
                case "debug":
                    console.debug = () => { };
                    break;
                case "info":
                    console.info = () => { };
                    break;
                default:
                    break;
            }
        });
    }
};
