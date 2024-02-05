# Mrucznik RP Typescript
Repozytorium zawiera rewrite kodu Mrucznik-RP na język Typescript z wykorzystaniem bitlioteki [Infernus](https://github.com/dockfries/infernus) opierającej się na [samp-node](https://github.com/AmyrAhmady/samp-node), [samp-node-lib](https://github.com/peterszombati/samp-node-lib) oraz [@sa-mp/node](https://github.com/samp-dev/node) na serwerze [openmultiplayer](https://github.com/openmultiplayer/open.mp).

[📚 **Dokumentacja Infernus**](https://dockfries.github.io/infernus/quick-start.html)

## WAŻNE

- [Czemu serwer crashuje przy pierwszym rozruchu??](https://github.com/dockfries/omp-node-starter/issues/12)
- Obecnie przy rozruchu następuje tzw. 'terminal blocking' - jest on spowodowany użyciem biblioteki mysql2. Po załadowaniu pluginu node-samp należy kliknąć 'enter' w terminalu uruchamiającym serwer. [Jak to rozwiązać?](https://dockfries.github.io/infernus/introduction.html#terminal-blocking) - Rozwiązaniem jest użycie API zamiast mysql, jednak na obecny moment staram się wypuścić gamemode jak najszybciej.


## Credits

- [openmultiplayer](https://github.com/openmultiplayer/open.mp)
- [samp-node](https://github.com/AmyrAhmady/samp-node)
- [samp-node-lib](https://github.com/peterszombati/samp-node-lib)
- [@sa-mp/node](https://github.com/samp-dev/node)

## License

[MIT](./LICENSE) License © 2024-PRESENT Mateusz Domińczak
