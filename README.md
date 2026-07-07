# Nora Lauková – web

Webová stránka pre Noru Laukovú, odborníčku na verbálnu a neverbálnu komunikáciu, lektorku, terapeutku a forenznú konzultantku.

Statický web (HTML/CSS/vanilla JS, bez build kroku) s dôrazom na minimalistický, luxusný dizajn (krém/béž/zlatá + terakota) a plnú responzivitu.

## Štruktúra

- `index.html` – domovská stránka (hero, o mne, čomu sa venujem, produkty, filozofia, newsletter, médiá, kontakt)
- `produkty.html` – kompletný katalóg kurzov, tréningov a knihy
- `o-nas.html` – rozšírené "o mne" / o značke
- `faq.html` – časté otázky
- `css/style.css` – dizajnový systém (farby, typografia, komponenty)
- `js/main.js` – navigácia, scroll reveal, FAQ akordeón, košík, formuláre
- `img/` – fotografie a obrázky
- `Info.docx`, `Kurzy.docx`, `FAQ.docx` – zdrojové podklady pre obsah

## Spustenie lokálne

Ide o čisto statický web, stačí ho servovať cez akýkoľvek HTTP server, napríklad:

```bash
python -m http.server 5500
```

a otvoriť `http://localhost:5500`.

## Poznámky pred nasadením naostro

- Kontaktný a newsletter formulár sú zatiaľ len frontendové (bez reálneho odosielania) – je potrebné napojiť na e-mailovú/CRM službu.
- Košík je nezáväzný "zoznam záujmu" (bez online platby), po odoslaní treba dopyt spracovať manuálne podľa podmienok registrácie kurzov.
