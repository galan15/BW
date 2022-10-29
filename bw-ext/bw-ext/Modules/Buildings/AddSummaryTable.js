class Buildings_AddSummaryTable extends Module {
    constructor() {
        super({ supportedUrl: '?a=build' });
    }

    execute() {
        const buildings = Array.from(document.querySelectorAll('.building')).map(buildingNode => {
            const nameNode = buildingNode.querySelector('.bldheader');
            const headerNode = nameNode.parentElement;

            const name = nameNode.textContent.trim();
            const level = headerNode.textContent.trim('\n', ' ').replace(/^\D+/g, '');

            return {
                name: name,
                level: Number(level)
            };
        });

        const contentMidNode = document.querySelector('.content-mid');

        HtmlElementFactory.createTable(table => {
            table.classList.add('hoverTable');
            table.style.width = Tools.formatPercent(40);
            table.style.margin = '10px auto';

            HtmlElementFactory.createTableHead(thead => {
                HtmlElementFactory.createTableRow(tr => {
                    tr.classList.add('tblheader');

                    HtmlElementFactory.createTableCell(td => {
                        td.textContent = 'Budynek';
                        td.style.textAlign = 'start';
                        tr.append(td);
                    });

                    HtmlElementFactory.createTableCell(td => {
                        td.textContent = 'Poziom';
                        td.style.textAlign = 'start';
                        tr.append(td);
                    });

                    thead.append(tr);
                });

                table.append(thead);
            });

            HtmlElementFactory.createTableBody(tbody => {
                buildings.forEach(building => {
                    HtmlElementFactory.createTableRow(tr => {
                        HtmlElementFactory.createTableCell(td => {
                            td.textContent = building.name;
                            tr.append(td);
                        });

                        HtmlElementFactory.createTableCell(td => {
                            td.textContent = building.level;
                            tr.append(td);
                        });

                        tbody.append(tr);
                    });
                });

                table.append(tbody);
            })

            contentMidNode.prepend(table);
        });
    }
}