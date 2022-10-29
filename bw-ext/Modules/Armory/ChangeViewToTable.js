class Armory_ChangeViewToTable extends Module {
    constructor(itemFactory) {
        super({ supportedUrl: '?a=equip' });

        this.itemFactory = itemFactory ?? new ItemFactory();
    }

    execute() {
        const items = Array.from(document.querySelectorAll('#stockItemList .item'))
            .map(node => this.itemFactory.create(node))
            .sort((a, b) => a.name.localeCompare(b.name));

        HtmlElementFactory.createTable(table => {
            table.classList.add('hoverTable');
            table.style.width = Tools.formatPercent(100);
            table.style.marginTop = Tools.formatPx(50);;

            HtmlElementFactory.createTableHead(thead => {
                HtmlElementFactory.createTableRow(tr => {
                    tr.classList.add('tblheader');

                    HtmlElementFactory.createTableCell(td => {
                        td.textContent = 'Nazwa';
                        td.style.textAlign = 'start';
                        tr.append(td);
                    });

                    HtmlElementFactory.createTableCell(td => {
                        td.textContent = 'Wartość PLN';
                        td.style.textAlign = 'end';
                        tr.append(td);
                    });

                    HtmlElementFactory.createTableCell(td => {
                        td.textContent = 'Akcje';
                        td.style.textAlign = 'start';
                        td.style.paddingLeft = Tools.formatPx(10);
                        tr.append(td);
                    });

                    thead.append(tr);
                });

                table.append(thead);
            });

            HtmlElementFactory.createTableBody(tbody => {
                items.forEach(item => {
                    const id = item.node.id.replace('masterNode_armory_', '');

                    HtmlElementFactory.createTableRow(tr => {
                        HtmlElementFactory.createTableCell(td => {
                            HtmlElementFactory.createSpan(span => {
                                span.classList.add('item-link');
                                span.setAttribute('onclick', item.linkNode.getAttribute('onclick'));
                                span.textContent = item.name;

                                td.append(span);
                            });

                            tr.append(td);
                        });

                        HtmlElementFactory.createTableCell(td => {
                            td.textContent = item.priceFormatted;
                            td.style.textAlign = 'end';
                            tr.append(td);
                        });

                        HtmlElementFactory.createTableCell(td => {
                            HtmlElementFactory.createSpan(span => {
                                span.classList.add('sellItem');
                                span.setAttribute('onclick', `return onSellItemClick(${id})`);
                                td.style.paddingLeft = Tools.formatPx(10);
                                span.textContent = 'SPRZEDAJ';

                                td.append(span);
                            });

                            tr.append(td);
                        });

                        tbody.append(tr);
                    });
                });

                table.append(tbody);
            });

            document.querySelector('.centerGroup').append(table);
        });
    }
}