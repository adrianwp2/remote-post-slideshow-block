function parseMargin(marginObj) {
    if (typeof marginObj === "string") {
        try {
            marginObj = JSON.parse(marginObj);
        } catch {
            return "0px";
        }
    }
    if (typeof marginObj === "object") {
        const top = marginObj.top || 0;
        const right = marginObj.right || 0;
        const bottom = marginObj.bottom || 0;
        const left = marginObj.left || 0;
        return `${top}px ${right}px ${bottom}px ${left}px`;
    }
    return "0px";
}

document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".wp-slideshow-container");
    if (!container) return;

    const dataset = {};
    for (const key in container.dataset) {
        dataset[key.toLowerCase()] = container.dataset[key];
    }

    const siteUrl = dataset.siteurl;
    const showDate = dataset.showdate === "1";
    const showAuthor = dataset.showauthor === "1";
    const autoScroll = dataset.autoscroll === "1";
    const intervalSec = parseInt(dataset.interval) || 5;

    const styles = {
        borderStyle: dataset.borderstyle,
        borderColor: dataset.bordercolor,
        borderWidth: dataset.borderwidth + "px",
        borderRadius: dataset.borderradius + "px",
        backgroundColor: dataset.backgroundcolor,

        contentPadding: dataset.contentpadding,

        titleColor: dataset.titlecolor,
        titleAlign: dataset.titlealign,
        titleSize: dataset.titlesize + "px",
        titleMargin: dataset.titlemargin,

        authorColor: dataset.authorcolor,
        authorAlign: dataset.authoralign,
        authorSize: dataset.authorsize + "px",
        authorMargin: dataset.authormargin,

        dateColor: dataset.datecolor,
        dateAlign: dataset.datealign,
        dateSize: dataset.datesize + "px",
        dateMargin: dataset.datemargin,
    };

    const cached = localStorage.getItem(siteUrl);

    if (cached) {
        renderSlides(JSON.parse(cached));
    } else {
        fetch(`${siteUrl}/wp-json/wp/v2/posts?_embed&per_page=5`)
            .then((res) => res.json())
            .then((posts) => {
                localStorage.setItem(siteUrl, JSON.stringify(posts));
                renderSlides(posts);
            });
    }

    function renderSlides(posts) {
        // let html = `<div class="slideshow"><div class="slides">`;
        let html = `
            <div class="wp-slideshow-wrapper">
                <button class="prev">←</button>
                <div class="slideshow">
                    <div class="slides">
            `;

        posts.forEach((post) => {
            const img =
                post._embedded["wp:featuredmedia"]?.[0]?.source_url || "";
            const author = post._embedded["author"]?.[0]?.name || "Unknown";

            html += `
                <div class="slide" style="
                    border: ${styles.borderWidth} ${styles.borderStyle} ${
                styles.borderColor
            };
                    border-radius: ${styles.borderRadius};
                    background-color: ${styles.backgroundColor};
                ">
                    <a href="${post.link}" target="_blank">
                        ${img ? `<img src="${img}" alt="">` : ""}
                        <div class="meta" style="padding: ${
                            styles.contentPadding
                        }px;">
                            <h3 style="color: ${
                                styles.titleColor
                            }; text-align: ${styles.titleAlign}; font-size: ${
                styles.titleSize
            }; margin: ${parseMargin(styles.titleMargin)};">
                                ${post.title.rendered}
                            </h3>
                            ${
                                showAuthor
                                    ? `<p class="author" style="color: ${
                                          styles.authorColor
                                      }; text-align: ${
                                          styles.authorAlign
                                      }; font-size: ${
                                          styles.authorSize
                                      }; margin: ${parseMargin(
                                          styles.authorMargin
                                      )};">By ${author}</p>`
                                    : ""
                            }
                            ${
                                showDate
                                    ? `<p class="date" style="color: ${
                                          styles.dateColor
                                      }; text-align: ${
                                          styles.dateAlign
                                      }; font-size: ${
                                          styles.dateSize
                                      }; margin: ${parseMargin(
                                          styles.dateMargin
                                      )};">${new Date(
                                          post.date
                                      ).toDateString()}</p>`
                                    : ""
                            }
                        </div>
                    </a>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        <button class="next">→</button>
        </div>
        <div class="change-site-url">
            <label>Load Posts From a different Source</label>
            <div class="source-input">
                <input type="text" id="new-site-url" placeholder="https://example.com" />
                <button id="load-new-site">Load</button>
            </div>
        </div>
        <div class="slideshow-loading-overlay hidden" id="slideshow-loading">
            <div class="spinner"></div>
        </div>
        `;
        container.innerHTML = html;

        initSlider();
    }

    function initSlider() {
        const slides = container.querySelector(".slides");
        const slideCount = slides.children.length;
        let index = 0;
        let interval;

        function update() {
            slides.style.transform = `translateX(-${index * 100}%)`;
        }

        function prevSlide() {
            index = (index + 1) % slideCount;
            update();
        }

        function nextSlide() {
            index = (index - 1 + slideCount) % slideCount;
            update();
        }

        container.querySelector(".prev").addEventListener("click", nextSlide);
        container.querySelector(".next").addEventListener("click", prevSlide);

        window.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft") nextSlide();
            if (e.key === "ArrowRight") prevSlide();
        });

        let startX = 0;
        slides.addEventListener(
            "touchstart",
            (e) => (startX = e.touches[0].clientX)
        );
        slides.addEventListener("touchend", (e) => {
            const deltaX = e.changedTouches[0].clientX - startX;
            if (deltaX > 50) nextSlide();
            else if (deltaX < -50) prevSlide();
        });

        if (autoScroll) {
            interval = setInterval(prevSlide, intervalSec * 1000);
        }

        const loadBtn = container.querySelector("#load-new-site");
        const input = container.querySelector("#new-site-url");

        if (loadBtn && input) {
            loadBtn.addEventListener("click", () => {
                const newUrl = input.value.trim();
                if (!newUrl.startsWith("http")) {
                    alert(
                        "Please enter a valid URL (starting with http/https)"
                    );
                    return;
                }

                localStorage.removeItem(siteUrl); // optional: clear previous cache
                localStorage.removeItem(newUrl); // clear new site's cache if old
                container.setAttribute("data-site-url", newUrl);
                container
                    .querySelector("#slideshow-loading")
                    ?.classList.remove("hidden");
                fetch(`${newUrl}/wp-json/wp/v2/posts?_embed&per_page=5`)
                    .then((res) => res.json())
                    .then((posts) => {
                        localStorage.setItem(newUrl, JSON.stringify(posts));
                        renderSlides(posts); // re-render with new data
                        container
                            .querySelector("#slideshow-loading")
                            ?.classList.add("hidden");
                    })
                    .catch((err) => {
                        alert("Failed to load posts from new site.");
                        console.error(err);
                        container
                            .querySelector("#slideshow-loading")
                            ?.classList.add("hidden");
                    });
            });
        }
    }
});
