const queue = () => {
    const endpoint = "https://5bc8d3808bfe5a00131b6f96.mockapi.io/api/quotations";
    let tableEl;
    function init() {
        tableEl = document.querySelector(".js-quote-wrapper");
        initServiceWorker();
        bindEvents();
        loadQuotations();
    }

    function initServiceWorker() {
        if ("serviceWorker" in navigator) {
			navigator.serviceWorker.register("./sw_queue.js")
				.then(swReg => {
					console.log("Service Worker is registered", swReg);
				})
				.catch(err => {
					console.error("Service Worker Error", err);
				});
		} else {
            loadQuotations();
        }
    }

    function bindEvents() {
        const formEl = document.querySelector(".js-quote-form");
        formEl.addEventListener("submit", e => onFormSubmit(e, formEl));
        document.addEventListener("click", onDocClick);
        window.addEventListener("online", () => loadQuotations());
    }

    function onFormSubmit(e, formEl) {
        e.preventDefault();
        const formData = [...formEl.querySelectorAll("input")].reduce((accum, el) => {
            accum[el.name] = el.value;
            return accum;
        }, {});

        fetch(endpoint, { 
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
        .then(function(response) {
            if (response.status === 202) {
                return Promise.resolve(formData);
            }
            return response.json();
        })
        .then(function(resp) {
            tableEl.insertAdjacentHTML("beforeend", renderRow(resp));
        });
    }

    function onDocClick(e) {
        if (e.target.matches(".js-delete")) {
            deleteQuote(e.target.dataset.id);
        }
    }

    function loadQuotations() {
        fetch(endpoint)
            .then(function(response) {
            return response.json();
            })
            .then(showQuotations);
    }

    function showQuotations(collection) {
        tableEl.innerHTML = collection.reduce((accum, quote) => {
            return accum + renderRow(quote);
        }, "");
    }

    function renderRow(quote) {
        return `
            <tr data-id="${quote.id}">
                <td>
                    <strong>"${quote.text}"</strong>
                </td>
                <td>
                    - ${quote.author}
                </td>
                <td class="js-action-cell">
                    ${renderDeleteBtn(quote)}
                </td>
                
            </tr>
        `;
    }

    function renderDeleteBtn(quote) {
        if (quote.id) {
            return `<button class="js-delete" data-id=${quote.id}>Delete</button>`;
        } else {
            return "(in queue...)";
        }
    }

    function deleteQuote(id) {
        return fetch(`${endpoint}/${id}`, { method: "DELETE" })
            .then(resp => {
                const rowEl = tableEl.querySelector(`[data-id="${id}"]`);
                if (resp.status === 204) {
                    const actionCell = rowEl.querySelector(".js-action-cell");
                    actionCell.innerHTML = "(in queue to delete...)";
                } else {
                    rowEl.parentNode.removeChild(rowEl);
                }
            });
    }

    

    init();
};

queue();