# ES/PT marketing pages import

Source: live WP sitemaps (page + taxonomy). English pages not cloned.

**Export packs checked:** `/home/jairoprodev/proyectos/pgt/03-seo/datos/` only has EN `inventario-sitemap-2026-08-31/pages.txt` (perugrandtravel.com). No ES/PT page export packs — live scrape used.

**Scraper:** `scripts/scrape-locale-pages.py` (re-run with `--resync` to refresh).

## Counts

| Market | Discovered | Written | Kept (inventario) | Skipped |
|--------|------------|---------|-------------------|---------|
| ES | 44 | 40 | 42 | 4 |
| PT | 66 | 64 | 65 | 2 |

## Skip reasons

### ES
- **existing-hub-or-home**: 3
- **newsletter**: 1

### PT
- **existing-hub-or-home**: 2

## Notable gaps

- **ES**: No `/peru/` destination tree in WP sitemap — only regional hub pages (`/tours-lima/`, etc.) and `/destinos/`.
- **PT**: 33 destination pages under `/peru/` scraped from live sitemap.

## Written files

### ES (40 new)
- `src/content/es/pages/amazonas-2.json`
- `src/content/es/pages/camino-inca.json`
- `src/content/es/pages/codigo-de-etica-esnna.json`
- `src/content/es/pages/contacto.json`
- `src/content/es/pages/covid-19.json`
- `src/content/es/pages/destinos.json`
- `src/content/es/pages/documentos-legales.json`
- `src/content/es/pages/estilo-de-viaje.json`
- `src/content/es/pages/estilo-de-viaje__adrenalina.json`
- `src/content/es/pages/estilo-de-viaje__fiestas-y-eventos.json`
- `src/content/es/pages/estilo-de-viaje__trekking.json`
- `src/content/es/pages/estilo-de-viaje__turismo-cultural.json`
- `src/content/es/pages/estilo-de-viaje__turismo-de-aventura.json`
- `src/content/es/pages/estilo-de-viaje__viajes-combinados.json`
- `src/content/es/pages/estilo-de-viaje__viajes-tradicionales.json`
- `src/content/es/pages/full-day-cusco.json`
- `src/content/es/pages/metodos-de-pago.json`
- `src/content/es/pages/ofertas.json`
- `src/content/es/pages/paquetes-peru.json`
- `src/content/es/pages/politica-contra-la-explotacion-el-acoso-y-la-discriminacion.json`
- `src/content/es/pages/politicas-de-privacidad-y-proteccion-de-datos.json`
- `src/content/es/pages/politicas-terminos-y-condiciones.json`
- `src/content/es/pages/premios-y-reconocimientos.json`
- `src/content/es/pages/proyectos-comunitarios.json`
- `src/content/es/pages/proyectos-sociales.json`
- `src/content/es/pages/proyectos-sociales__campanas-de-limpieza.json`
- `src/content/es/pages/proyectos-sociales__navidad.json`
- `src/content/es/pages/salkantay-trek.json`
- `src/content/es/pages/sobre-nosotros.json`
- `src/content/es/pages/tour-personalizado.json`
- `src/content/es/pages/tours-arequipa.json`
- `src/content/es/pages/tours-cusco.json`
- `src/content/es/pages/tours-huaraz.json`
- `src/content/es/pages/tours-ica.json`
- `src/content/es/pages/tours-lima.json`
- `src/content/es/pages/tours-puno.json`
- `src/content/es/pages/turismo-sostenible.json`
- `src/content/es/pages/unete-a-peru-grand-travel.json`
- `src/content/es/pages/viajes-a-machu-picchu-desde-espana.json`
- `src/content/es/pages/viajes-a-machu-picchu-desde-mexico.json`

### PT (64 new)
- `src/content/pt/pages/codigo-de-conduta-esnna.json`
- `src/content/pt/pages/contato.json`
- `src/content/pt/pages/covid-19.json`
- `src/content/pt/pages/crie-seu-roteiro.json`
- `src/content/pt/pages/documentos-legais.json`
- `src/content/pt/pages/experiencias-de-viagem__adrenalina.json`
- `src/content/pt/pages/experiencias-de-viagem__aventura.json`
- `src/content/pt/pages/experiencias-de-viagem__combinadas.json`
- `src/content/pt/pages/experiencias-de-viagem__cultural.json`
- `src/content/pt/pages/experiencias-de-viagem__festas-e-eventos.json`
- `src/content/pt/pages/experiencias-de-viagem__tradicionais.json`
- `src/content/pt/pages/experiencias-de-viagem__trekking.json`
- `src/content/pt/pages/experiencias.json`
- `src/content/pt/pages/junte-se-a-nos-e-trabalhe-conosco.json`
- `src/content/pt/pages/metodos-de-pagamento.json`
- `src/content/pt/pages/pacotes-peru.json`
- `src/content/pt/pages/peru.json`
- `src/content/pt/pages/peru__arequipa.json`
- `src/content/pt/pages/peru__cusco.json`
- `src/content/pt/pages/peru__cusco__sitios-arqueologicos.json`
- `src/content/pt/pages/peru__cusco__sitios-arqueologicos__chinchero.json`
- `src/content/pt/pages/peru__cusco__sitios-arqueologicos__choquequirao.json`
- `src/content/pt/pages/peru__cusco__sitios-arqueologicos__coricancha.json`
- `src/content/pt/pages/peru__cusco__sitios-arqueologicos__ollantaytambo.json`
- `src/content/pt/pages/peru__cusco__sitios-arqueologicos__puka-pukara.json`
- `src/content/pt/pages/peru__cusco__sitios-arqueologicos__qenqo.json`
- `src/content/pt/pages/peru__cusco__sitios-arqueologicos__raqchi.json`
- `src/content/pt/pages/peru__cusco__sitios-arqueologicos__sacsayhuaman.json`
- `src/content/pt/pages/peru__cusco__sitios-arqueologicos__tambomachay.json`
- `src/content/pt/pages/peru__huaraz.json`
- `src/content/pt/pages/peru__ica.json`
- `src/content/pt/pages/peru__lima.json`
- `src/content/pt/pages/peru__lima__atracoes-naturais.json`
- `src/content/pt/pages/peru__lima__atracoes-naturais__costa-verde.json`
- `src/content/pt/pages/peru__lima__igrejas-e-conventos.json`
- `src/content/pt/pages/peru__lima__igrejas-e-conventos__basilica-catedral-de-lima.json`
- `src/content/pt/pages/peru__lima__igrejas-e-conventos__basilica-e-convento-de-sao-francisco.json`
- `src/content/pt/pages/peru__lima__igrejas-e-conventos__basilica-nossa-senhora-das-merces.json`
- `src/content/pt/pages/peru__lima__igrejas-e-conventos__convento-de-santo-domingo-lima-peru.json`
- `src/content/pt/pages/peru__lima__museus.json`
- `src/content/pt/pages/peru__lima__museus__museu-arqueologico-rafael-larco-herrera.json`
- `src/content/pt/pages/peru__lima__museus__museu-nacional-de-arqueologia-antropologia-e-historia-do-peru.json`
- `src/content/pt/pages/peru__lima__pracas-e-parques.json`
- `src/content/pt/pages/peru__lima__pracas-e-parques__circuito-magico-das-aguas.json`
- `src/content/pt/pages/peru__lima__pracas-e-parques__parque-do-amor.json`
- `src/content/pt/pages/peru__lima__sitios-arqueologicos.json`
- `src/content/pt/pages/peru__lima__sitios-arqueologicos__caral.json`
- `src/content/pt/pages/peru__lima__sitios-arqueologicos__huaca-pucllana.json`
- `src/content/pt/pages/peru__lima__sitios-arqueologicos__pachacamac.json`
- `src/content/pt/pages/peru__puno.json`
- `src/content/pt/pages/politicas-de-privacidade-e-protecao-de-dados.json`
- `src/content/pt/pages/politicas-termos-e-condicoes.json`
- `src/content/pt/pages/premios-e-reconhecimentos.json`
- `src/content/pt/pages/projetos-comunitarios.json`
- `src/content/pt/pages/projetos-sociais.json`
- `src/content/pt/pages/promocoes.json`
- `src/content/pt/pages/quem-somos.json`
- `src/content/pt/pages/tornar-se-parceiro.json`
- `src/content/pt/pages/tours-opcionais.json`
- `src/content/pt/pages/trilha-inca-jungle.json`
- `src/content/pt/pages/trilha-inca-peru.json`
- `src/content/pt/pages/trilha-salkantay.json`
- `src/content/pt/pages/turismo-sustentavel.json`
- `src/content/pt/pages/viagens-machu-picchu.json`

