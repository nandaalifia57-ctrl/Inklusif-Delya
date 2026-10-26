        const pages = {
            home: document.querySelector("#page-home"),
            menu: document.querySelector("#page-menu"),
            material: document.querySelector("#page-material"),
            game: document.querySelector("#page-game")
        };
        const status = document.querySelector("#status");
        const listenButton = document.querySelector("#listen-button");
        const lessonDetails = {
            posisi: {
                title: "Posisi — Di mana aku berada?",
                description: "Posisi adalah letak suatu benda dibandingkan dengan titik acuan. Contoh: Rani berdiri 2 meter di sebelah kanan sebuah pohon. Pohon menjadi titik acuannya, dan posisi Rani berada 2 meter di sebelah kanan pohon."
            },
            jarak: {
                title: "Jarak — Seberapa jauh aku bergerak?",
                description: "Jarak adalah panjang seluruh lintasan yang ditempuh benda dan tidak memperhatikan arah. Contoh: Bimo berjalan 3 meter ke depan lalu 2 meter lagi. Jarak yang ditempuh Bimo adalah 5 meter."
            },
            perpindahan: {
                title: "Perpindahan — Dari mana dan ke mana aku bergerak?",
                description: "Perpindahan adalah perubahan posisi dari titik awal ke titik akhir dan memperhatikan arah. Contoh: Siti berjalan 5 meter ke timur lalu 2 meter ke barat. Perpindahannya 3 meter ke timur dari titik awal."
            }
        };
        const movementRoutes = [
            {
                route: ["A", "B"],
                travel: ["A", "B"],
                question: { text: "", answers: [], correct: null }
            },
            {
                route: ["B", "C"],
                travel: ["B", "C"],
                question: { text: "", answers: [], correct: null }
            },
            {
                route: ["A", "C"],
                travel: ["A", "C"],
                question: { text: "", answers: [], correct: null }
            },
            {
                route: ["C", "B"],
                travel: ["C", "B"],
                question: { text: "", answers: [], correct: null }
            },
            {
                route: ["A", "B", "C"],
                travel: ["A", "B", "C"],
                question: { text: "", answers: [], correct: null }
            },
            {
                route: ["A", "B", "C", "B"],
                travel: ["A", "B", "C", "B"],
                question: { text: "", answers: [], correct: null }
            }
        ];
        const quizQuestions = [
            {
                category: "Posisi",
                text: "Mobil berada di titik B. Di mana posisi mobil?",
                answers: ["Titik A", "Titik B", "Titik C"],
                hint: "Lihat huruf pada titik tempat mobil berhenti.",
                movement: { start: "B", path: [] },
                answerType: "position"
            },
            {
                category: "Posisi",
                text: "Mobil bergerak dari titik A ke titik B. Di mana posisi akhirnya?",
                answers: ["Titik A", "Titik B", "Titik C"],
                hint: "Mobil berhenti di titik tujuan.",
                movement: { start: "A", path: ["B"] },
                answerType: "position"
            },
            {
                category: "Posisi",
                text: "Mobil bergerak dari titik B ke titik C. Di mana posisi akhirnya?",
                answers: ["Titik A", "Titik B", "Titik C"],
                hint: "Ikuti arah panah sampai titik tujuan.",
                movement: { start: "B", path: ["C"] },
                answerType: "position"
            },
            {
                category: "Jarak",
                text: "Mobil bergerak dari START ke A. Berapa jarak yang ditempuh?",
                answers: ["5 meter", "10 meter", "15 meter"],
                hint: "Satu ruas lintasan panjangnya 5 meter.",
                movement: { start: "START", path: ["A"] },
                answerType: "distance"
            },
            {
                category: "Jarak",
                text: "Mobil bergerak dari START ke A, lalu ke B. Berapa jarak totalnya?",
                answers: ["5 meter", "10 meter", "15 meter"],
                hint: "Jumlahkan jarak START ke A dan A ke B.",
                movement: { start: "START", path: ["A", "B"] },
                answerType: "distance"
            },
            {
                category: "Jarak",
                text: "Mobil bergerak dari A ke B, lalu ke C, kemudian kembali ke B. Berapa jarak totalnya?",
                answers: ["5 meter", "10 meter", "15 meter"],
                hint: "Hitung semua ruas yang dilalui, termasuk perjalanan kembali.",
                movement: { start: "A", path: ["B", "C", "B"] },
                answerType: "distance"
            },
            {
                category: "Perpindahan",
                text: "Mobil bergerak dari A ke B. Ke arah mana perpindahannya?",
                answers: ["Ke kanan", "Ke kiri", "Tidak berpindah"],
                hint: "A ada di sebelah kiri B.",
                movement: { start: "A", path: ["B"] },
                answerType: "direction"
            },
            {
                category: "Perpindahan",
                text: "Mobil mulai dari A, bergerak ke B, lalu ke C. Di mana posisi akhirnya?",
                answers: ["Titik A", "Titik B", "Titik C"],
                hint: "Lihat titik terakhir yang dicapai mobil.",
                movement: { start: "A", path: ["B", "C"] },
                answerType: "position"
            },
            {
                category: "Perpindahan",
                text: "Mobil mulai dari A, bergerak ke B, lanjut ke C, lalu kembali ke B. Berapa perpindahannya dari titik awal A?",
                answers: ["0 meter", "5 meter ke kanan", "15 meter ke kanan"],
                hint: "Bandingkan posisi awal A dengan posisi akhir B.",
                movement: { start: "A", path: ["B", "C", "B"] },
                answerType: "displacement"
            }
        ];
        const positionMeters = { START: -5, A: 0, B: 5, C: 10 };
        let speechActive = false;
        let speechRequestId = 0;
        let selectedMovementRoute = null;
        let routeAnswerSubmitted = false;
        let quizQuestionOrder = [];
        let quizQuestionIndex = 0;
        let quizScore = 0;
        let updateCarFromSlider = () => {};
        let completeCarWaypoint = () => {};
        let resetCarActivity = () => {};
        let advanceRouteInstruction = () => {};

        function stopSpeech() {
            if (!("speechSynthesis" in window)) return;
            speechRequestId++;
            window.speechSynthesis.cancel();
            speechActive = false;
            listenButton.setAttribute("aria-pressed", "false");
            listenButton.textContent = "Dengarkan sambutan";
        }

        function speakWelcome() {
            if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
                status.textContent = "Browser ini belum mendukung fitur suara. Kamu tetap bisa menggunakan semua tombol dan materi.";
                return;
            }

            const requestId = ++speechRequestId;
            const welcome = new SpeechSynthesisUtterance(
                "Selamat datang di Gerak Ceria, petualangan gerak lurus. Ayo belajar posisi, jarak, dan perpindahan melalui petualangan sehari-hari. Tekan Mulai untuk memilih aktivitas."
            );
            welcome.lang = "id-ID";
            welcome.addEventListener("end", () => {
                if (requestId !== speechRequestId) return;
                speechActive = false;
                listenButton.setAttribute("aria-pressed", "false");
                listenButton.textContent = "Dengarkan sambutan";
                status.textContent = "Sambutan selesai.";
            });
            welcome.addEventListener("error", () => {
                if (requestId !== speechRequestId) return;
                speechActive = false;
                listenButton.setAttribute("aria-pressed", "false");
                listenButton.textContent = "Dengarkan sambutan";
                status.textContent = "Suara tidak dapat diputar. Tekan Dengarkan sambutan untuk mencoba lagi.";
            });

            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(welcome);
            speechActive = true;
            listenButton.setAttribute("aria-pressed", "true");
            listenButton.textContent = "Hentikan suara";
            status.textContent = "Sambutan sedang diputar.";
        }

        function speakExplanation(text) {
            const audioStatus = document.querySelector("#game-audio-status");
            if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
                audioStatus.textContent = "Browser ini belum mendukung fitur suara.";
                return;
            }

            const requestId = ++speechRequestId;
            const explanation = new SpeechSynthesisUtterance(text);
            explanation.lang = "id-ID";
            explanation.addEventListener("end", () => {
                if (requestId !== speechRequestId) return;
                speechActive = false;
                audioStatus.textContent = "Penjelasan selesai.";
            });
            explanation.addEventListener("error", () => {
                if (requestId !== speechRequestId) return;
                speechActive = false;
                audioStatus.textContent = "Suara tidak dapat diputar. Silakan coba lagi.";
            });

            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(explanation);
            speechActive = true;
            audioStatus.textContent = "Penjelasan sedang diputar.";
        }

        function showPage(pageName, addHistory = true) {
            if (!pages[pageName]) return;

            stopSpeech();
            Object.entries(pages).forEach(([name, page]) => {
                page.hidden = name !== pageName;
            });
            if (pageName === "game") {
                document.querySelector("#game-intro").hidden = true;
                document.querySelector("#game-play").hidden = false;
            }

            if (addHistory) {
                history.pushState({ page: pageName }, "", `#${pageName}`);
            }

            window.scrollTo(0, 0);
            const heading = pageName === "game"
                ? document.querySelector("#route-question-screen").hidden
                    ? document.querySelector("#route-screen-title")
                    : document.querySelector("#route-question-title")
                : pages[pageName].querySelector("h1");
            if (heading) {
                heading.setAttribute("tabindex", "-1");
                heading.focus({ preventScroll: true });
            }
        }

        function createRouteIllustration(route, index, interactive = false, travel = route, carAt = travel[0]) {
            const svgNamespace = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNamespace, "svg");
            svg.setAttribute("class", "route-illustration");
            svg.setAttribute("viewBox", "0 0 360 170");
            svg.setAttribute("role", interactive ? "group" : "img");
            svg.setAttribute("aria-label", `Ilustrasi rute ${route.join(" ke ")}`);

            const addShape = (tag, attributes) => {
                const shape = document.createElementNS(svgNamespace, tag);
                Object.entries(attributes).forEach(([name, value]) => shape.setAttribute(name, value));
                svg.append(shape);
                return shape;
            };

            const title = document.createElementNS(svgNamespace, "title");
            title.textContent = `Mobil bergerak: ${route.join(" → ")}`;
            svg.append(title);
            addShape("rect", { x: 0, y: 0, width: 360, height: 170, fill: "#9be7fb" });
            addShape("circle", { cx: 43, cy: 34, r: 17, fill: "#fff" });
            addShape("circle", { cx: 61, cy: 30, r: 22, fill: "#fff" });
            addShape("circle", { cx: 80, cy: 36, r: 16, fill: "#fff" });
            addShape("circle", { cx: 278, cy: 36, r: 17, fill: "#fff" });
            addShape("circle", { cx: 297, cy: 30, r: 22, fill: "#fff" });
            addShape("circle", { cx: 316, cy: 36, r: 16, fill: "#fff" });
            addShape("rect", { x: 0, y: 79, width: 360, height: 27, fill: "#83d65b" });
            addShape("rect", { x: 0, y: 105, width: 360, height: 48, fill: "#54788c" });
            addShape("line", {
                x1: 0, y1: 129, x2: 360, y2: 129,
                stroke: "#fff", "stroke-width": 4, "stroke-dasharray": "22 16"
            });
            addShape("rect", { x: 0, y: 151, width: 360, height: 19, fill: "#83d65b" });

            const positions = { START: 35, A: 125, B: 225, C: 325 };

            [["START", "A"], ["A", "B"], ["B", "C"]].forEach(([from, to]) => {
                const distanceLabel = addShape("text", {
                    x: (positions[from] + positions[to]) / 2,
                    y: 81,
                    class: "route-distance-label"
                });
                distanceLabel.textContent = "5 meter";
            });

            travel.slice(0, -1).forEach((point, routeIndex) => {
                const start = positions[point];
                const end = positions[travel[routeIndex + 1]];
                if (start === undefined || end === undefined) return;
                const direction = end > start ? 1 : -1;
                const lineStart = start + direction * 20;
                const lineEnd = end - direction * 28;
                addShape("line", {
                    x1: lineStart, y1: 94, x2: lineEnd, y2: 94,
                    stroke: "#ffce36", "stroke-width": 9, "stroke-linecap": "round"
                });
                addShape("path", {
                    d: direction > 0
                        ? `M ${lineEnd - 12} 84 L ${lineEnd} 94 L ${lineEnd - 12} 104 Z`
                        : `M ${lineEnd + 12} 84 L ${lineEnd} 94 L ${lineEnd + 12} 104 Z`,
                    fill: "#ffae24"
                });
            });

            const pointColors = { A: "#f45e68", B: "#248ee0", C: "#4db85d" };
            const startX = positions.START;
            addShape("line", { x1: startX, y1: 78, x2: startX, y2: 119, class: "route-marker-line" });
            addShape("circle", { cx: startX, cy: 65, r: 12, fill: "#174879", class: "route-marker-dot" });
            const startLabel = addShape("text", {
                x: startX, y: 45, class: "start-label"
            });
            startLabel.textContent = "START";

            ["A", "B", "C"].forEach((point) => {
                const x = positions[point];
                addShape("line", { x1: x, y1: 78, x2: x, y2: 119, class: "route-marker-line" });
                addShape("circle", { cx: x, cy: 65, r: 22, fill: "#fff", opacity: 0.9 });
                addShape("circle", { cx: x, cy: 65, r: 18, fill: pointColors[point], class: "route-marker-dot" });
                if (interactive) {
                    addShape("circle", {
                        cx: x, cy: 65, r: 29,
                        class: "route-target-ring",
                        opacity: point === travel[1] ? 1 : 0
                    });
                }
                const label = addShape("text", {
                    x, y: 73, class: "route-marker-text"
                });
                label.textContent = point;
            });

            const car = document.createElementNS(svgNamespace, "g");
            car.setAttribute("class", "route-car");
            car.setAttribute("transform", `translate(${positions[interactive ? travel[0] : carAt]}, 0)`);
            const addCarShape = (tag, attributes) => {
                const shape = document.createElementNS(svgNamespace, tag);
                Object.entries(attributes).forEach(([name, value]) => shape.setAttribute(name, value));
                car.append(shape);
            };
            addCarShape("path", {
                d: "M -26 108 l 11 -11 h 24 l 10 11 h 8 v 15 h -55 v -12 z",
                fill: "#ee4b55",
                stroke: "#334c5e",
                "stroke-width": 3,
                "stroke-linejoin": "round"
            });
            addCarShape("path", {
                d: "M -11 100 h 9 v 8 h -17 z M 2 100 h 10 l 8 8 h -18 z",
                fill: "#d8f5ff",
                stroke: "#334c5e",
                "stroke-width": 2
            });
            addCarShape("circle", { cx: -20, cy: 123, r: 6, fill: "#263d50" });
            addCarShape("circle", { cx: 20, cy: 123, r: 6, fill: "#263d50" });
            addCarShape("circle", { cx: -20, cy: 123, r: 2.5, fill: "#fff" });
            addCarShape("circle", { cx: 20, cy: 123, r: 2.5, fill: "#fff" });
            svg.append(car);

            if (interactive) {
                svg.classList.add("is-draggable");
                car.setAttribute("tabindex", "0");
                car.setAttribute("role", "img");
                car.setAttribute("aria-label", `Mobil di ${travel[0]}. Seret ke titik ${travel[1]}.`);
                car.setAttribute("aria-roledescription", "mobil yang bisa digerakkan");

                const initialPosition = travel[0];
                const initialX = positions[initialPosition];
                const initialMeters = positionMeters[initialPosition];
                let carPosition = initialX;
                let travelledMeters = 0;
                let reachedPosition = initialPosition;
                let checkpointIndex = 0;
                let legCompleted = false;
                let dragging = false;
                let dragOffset = 0;
                const targetRings = [...svg.querySelectorAll(".route-target-ring")];
                const movementStatus = document.querySelector("#car-movement-status");
                const positionSlider = document.querySelector("#car-position-slider");
                const nextButton = document.querySelector("#next-instruction");
                const finishButton = document.querySelector("#instruction-done");
                positionSlider.value = String(initialX - positions.START);
                const isRouteCompleted = () =>
                    checkpointIndex === travel.length - 1
                    && reachedPosition === travel[travel.length - 1];
                const metersForX = (x) => {
                    const orderedPoints = ["START", "A", "B", "C"];
                    const segmentIndex = orderedPoints.findIndex((point, index) =>
                        index < orderedPoints.length - 1 && x <= positions[orderedPoints[index + 1]]
                    );
                    const from = orderedPoints[Math.max(0, segmentIndex)];
                    const to = orderedPoints[Math.min(orderedPoints.length - 1, segmentIndex + 1)];
                    const segmentProgress = (x - positions[from]) / (positions[to] - positions[from]);
                    return positionMeters[from] + segmentProgress * (positionMeters[to] - positionMeters[from]);
                };
                const pointForMeters = (meters) => {
                    const markerNames = Object.keys(positions);
                    const nearest = markerNames.reduce((closest, point) =>
                        Math.abs(positions[point] - carPosition) < Math.abs(positions[closest] - carPosition)
                            ? point
                            : closest
                    , "START");
                    if (Math.abs(meters - metersForX(positions[nearest])) <= 2.2) return nearest;
                    const ordered = markerNames;
                    for (let markerIndex = 0; markerIndex < ordered.length - 1; markerIndex++) {
                        const from = ordered[markerIndex];
                        const to = ordered[markerIndex + 1];
                        if (meters > metersForX(positions[from]) && meters < metersForX(positions[to])) {
                            return `Di antara ${from} dan ${to}`;
                        }
                    }
                    return nearest;
                };
                const formatMeters = (value) => `${Number(value.toFixed(1))} meter`;
                const updateSummary = () => {
                    const currentMeters = positionMeters[reachedPosition];
                    const displacement = currentMeters - initialMeters;
                    const direction = displacement === 0 ? "" : displacement > 0 ? " ke kanan" : " ke kiri";
                    document.querySelector("#initial-position").textContent = initialPosition;
                    document.querySelector("#travel-distance").textContent = formatMeters(travelledMeters);
                    document.querySelector("#displacement-distance").textContent =
                        `${formatMeters(Math.abs(displacement))}${direction}`;
                    document.querySelector("#final-position").textContent =
                        isRouteCompleted() ? reachedPosition : "Belum selesai";
                    const target = isRouteCompleted() ? "" : ` Seret ke titik ${travel[checkpointIndex + 1]}.`;
                    car.setAttribute("aria-label", `Mobil di ${pointForMeters(metersForX(carPosition))}.${target}`);
                };
                positionSlider.disabled = false;
                const setCarPosition = (position) => {
                    const nextPosition = Math.max(positions.START, Math.min(positions.C, position));
                    carPosition = nextPosition;
                    car.setAttribute("transform", `translate(${carPosition}, 0)`);
                    positionSlider.value = String(Math.round(carPosition - positions.START));
                    updateSummary();
                };
                const setTargetRing = (point) => {
                    targetRings.forEach((ring) => {
                        ring.setAttribute("opacity", ring.getAttribute("cx") === String(positions[point]) ? "1" : "0");
                    });
                };
                const targetReached = () => {
                    if (legCompleted || isRouteCompleted()) return;
                    const target = travel[checkpointIndex + 1];
                    if (!target) return;
                    if (Math.abs(carPosition - positions[target]) > 22) {
                        movementStatus.textContent = "Ayo, coba lagi! Gerakkan mobil ke posisi yang diminta.";
                        return;
                    }

                    const targetMeters = positionMeters[target];
                    travelledMeters += Math.abs(targetMeters - positionMeters[reachedPosition]);
                    carPosition = positions[target];
                    car.setAttribute("transform", `translate(${carPosition}, 0)`);
                    positionSlider.value = String(Math.round(carPosition - positions.START));
                    reachedPosition = target;
                    checkpointIndex++;
                    const routeCompleted = isRouteCompleted();
                    legCompleted = routeCompleted;
                    positionSlider.disabled = routeCompleted;
                    movementStatus.textContent = routeCompleted
                        ? "Hebat! Kamu berhasil menyelesaikan seluruh rute!"
                        : `Titik ${target} tercapai. Lanjutkan ke titik ${travel[checkpointIndex + 1]}.`;
                    updateSummary();
                    if (!routeCompleted) {
                        setTargetRing(travel[checkpointIndex + 1]);
                        nextButton.hidden = true;
                        nextButton.disabled = true;
                    } else {
                        nextButton.hidden = true;
                        nextButton.disabled = true;
                        finishButton.hidden = false;
                        finishButton.disabled = false;
                    }
                };
                const advanceInstruction = () => {
                    if (!legCompleted || isRouteCompleted() || checkpointIndex >= travel.length - 1) return;
                    legCompleted = false;
                    positionSlider.disabled = false;
                    nextButton.hidden = true;
                    nextButton.disabled = true;
                    const nextPoint = travel[checkpointIndex + 1];
                    setTargetRing(nextPoint);
                    movementStatus.textContent = `Sekarang, pindahkan mobil ke ${nextPoint}. Mobil tetap di posisi terakhir.`;
                    car.setAttribute("aria-label", `Mobil di ${pointForMeters(metersForX(carPosition))}. Seret ke titik ${nextPoint}.`);
                    updateSummary();
                    svg.scrollIntoView({ block: "center" });
                };
                const resetActivity = () => {
                    dragging = false;
                    carPosition = initialX;
                    travelledMeters = 0;
                    reachedPosition = initialPosition;
                    checkpointIndex = 0;
                    legCompleted = false;
                    setCarPosition(initialX);
                    positionSlider.disabled = false;
                    nextButton.hidden = true;
                    nextButton.disabled = true;
                    finishButton.hidden = true;
                    finishButton.disabled = true;
                    setTargetRing(travel[1]);
                    movementStatus.textContent = `Seret mobil dari ${initialPosition} ke ${travel[1]}.`;
                    car.setAttribute("aria-label", `Mobil di ${initialPosition}. Seret ke titik ${travel[1]}.`);
                    updateSummary();
                };

                setTargetRing(travel[1]);
                updateSummary();
                movementStatus.textContent = `Seret mobil dari ${initialPosition} ke ${travel[1]}.`;
                updateCarFromSlider = (value) => {
                    if (legCompleted || isRouteCompleted()) return;
                    setCarPosition(positions.START + Number(value));
                    targetReached();
                };
                completeCarWaypoint = targetReached;
                resetCarActivity = resetActivity;
                advanceRouteInstruction = advanceInstruction;

                const getSvgPoint = (event) => {
                    const point = svg.createSVGPoint();
                    point.x = event.clientX;
                    point.y = event.clientY;
                    return point.matrixTransform(svg.getScreenCTM().inverse());
                };
                svg.addEventListener("pointerdown", (event) => {
                    if (!event.target.closest(".route-car") || legCompleted) return;
                    event.preventDefault();
                    dragging = true;
                    dragOffset = getSvgPoint(event).x - carPosition;
                    svg.setPointerCapture(event.pointerId);
                });
                svg.addEventListener("pointermove", (event) => {
                    if (!dragging) return;
                    setCarPosition(getSvgPoint(event).x - dragOffset);
                    targetReached();
                });
                svg.addEventListener("pointerup", (event) => {
                    if (!dragging) return;
                    dragging = false;
                    setCarPosition(getSvgPoint(event).x - dragOffset);
                    targetReached();
                });
                svg.addEventListener("pointercancel", () => {
                    dragging = false;
                });
            }

            return svg;
        }

        function renderRouteCards() {
            const routeGrid = document.querySelector("#route-grid");
            routeGrid.replaceChildren();

            movementRoutes.forEach((route, index) => {
                const card = document.createElement("button");
                card.type = "button";
                card.className = "route-card";
                card.setAttribute("aria-label", `Pilih rute ${route.route.join(" ke ")}`);
                card.append(createRouteIllustration(route.route, index, false, route.travel));

                const label = document.createElement("span");
                label.className = "route-label";
                label.textContent = route.route.join(" → ");
                card.append(label);
                card.addEventListener("click", () => openRouteInstruction(index));
                routeGrid.append(card);
            });
        }

        function showRouteScreen(screenName) {
            document.querySelector("#route-screen").hidden = screenName !== "routes";
            document.querySelector("#route-instruction").hidden = screenName !== "instruction";
            document.querySelector("#route-question-screen").hidden = screenName !== "question";
            document.querySelector("#quiz-complete-screen").hidden = screenName !== "complete";
            window.scrollTo(0, 0);
        }

        function openRouteInstruction(routeIndex) {
            selectedMovementRoute = movementRoutes[routeIndex];
            document.querySelector("#next-instruction").hidden = true;
            document.querySelector("#next-instruction").disabled = true;
            document.querySelector("#instruction-done").hidden = true;
            document.querySelector("#instruction-done").disabled = true;
            document.querySelector("#instruction-title").textContent =
                `Rute ${selectedMovementRoute.route.join(" → ")}`;
            document.querySelector("#instruction-illustration").replaceChildren(
                createRouteIllustration(
                    selectedMovementRoute.route,
                    routeIndex,
                    true,
                    selectedMovementRoute.travel
                )
            );
            const instruction = selectedMovementRoute.travel
                .slice(0, -1)
                .map((point, index) => `dari ${point} ke ${selectedMovementRoute.travel[index + 1]}`)
                .join(", lalu ");
            const instructionText = `Ayo, pindahkan mobil ${instruction}!`;
            document.querySelector("#instruction-text").textContent = instructionText;
            document.querySelector("#listen-instruction").dataset.speak = instructionText;
            showRouteScreen("instruction");
            document.querySelector("#instruction-title").setAttribute("tabindex", "-1");
            document.querySelector("#instruction-title").focus();
        }

        function measureMovement(movement) {
            const startMeters = positionMeters[movement.start];
            if (typeof startMeters !== "number") {
                throw new Error(`Posisi awal tidak dikenal: ${movement.start}`);
            }

            let currentMeters = startMeters;
            let distance = 0;
            movement.path.forEach((point) => {
                const nextMeters = positionMeters[point];
                if (typeof nextMeters !== "number") {
                    throw new Error(`Posisi tujuan tidak dikenal: ${point}`);
                }
                distance += Math.abs(nextMeters - currentMeters);
                currentMeters = nextMeters;
            });

            return {
                distance,
                displacement: currentMeters - startMeters,
                finalPosition: movement.path[movement.path.length - 1] || movement.start
            };
        }

        function getExpectedAnswer(question) {
            const movement = measureMovement(question.movement);
            switch (question.answerType) {
                case "position":
                    return `Titik ${movement.finalPosition}`;
                case "distance":
                    return `${movement.distance} meter`;
                case "direction":
                    return movement.displacement > 0
                        ? "Ke kanan"
                        : movement.displacement < 0
                            ? "Ke kiri"
                            : "Tidak berpindah";
                case "displacement":
                    if (movement.displacement === 0) return "0 meter";
                    return `${Math.abs(movement.displacement)} meter ke ${movement.displacement > 0 ? "kanan" : "kiri"}`;
                default:
                    throw new Error(`Jenis jawaban tidak dikenal: ${question.answerType}`);
            }
        }

        function startQuizSession() {
            quizQuestionOrder = quizQuestions.slice();
            for (let index = quizQuestionOrder.length - 1; index > 0; index--) {
                const randomIndex = Math.floor(Math.random() * (index + 1));
                [quizQuestionOrder[index], quizQuestionOrder[randomIndex]] =
                    [quizQuestionOrder[randomIndex], quizQuestionOrder[index]];
            }
            quizQuestionIndex = 0;
            quizScore = 0;
            routeAnswerSubmitted = false;
            selectedMovementRoute = null;
        }

        function renderQuizQuestion() {
            const question = quizQuestionOrder[quizQuestionIndex];
            if (!question) {
                showQuizCompletion();
                return;
            }

            const expectedAnswer = getExpectedAnswer(question);
            if (!question.answers.includes(expectedAnswer)) {
                throw new Error(`Kunci jawaban tidak ditemukan untuk soal: ${question.text}`);
            }

            routeAnswerSubmitted = false;
            document.querySelector("#question-progress").textContent =
                `Soal ${quizQuestionIndex + 1} dari ${quizQuestionOrder.length}`;
            document.querySelector("#question-category").textContent = question.category;
            document.querySelector("#route-question-text").textContent = question.text;
            document.querySelector("#route-feedback").textContent = "";
            document.querySelector("#quiz-hint").hidden = true;
            document.querySelector("#quiz-star-burst").hidden = true;
            document.querySelector("#route-question-actions").hidden = true;
            document.querySelector("#next-quiz-question").textContent =
                quizQuestionIndex === quizQuestionOrder.length - 1 ? "Lihat Hasil" : "Soal Berikutnya";

            const travel = [question.movement.start, ...question.movement.path];
            const board = document.querySelector("#quiz-board");
            board.replaceChildren(createRouteIllustration(
                travel,
                quizQuestionIndex,
                false,
                travel,
                measureMovement(question.movement).finalPosition
            ));

            const answerList = document.querySelector("#route-answer-list");
            answerList.replaceChildren();
            question.answers.forEach((answer, answerIndex) => {
                const button = document.createElement("button");
                button.type = "button";
                button.textContent = `${String.fromCharCode(65 + answerIndex)}. ${answer}`;
                button.setAttribute("aria-label", `Pilihan ${String.fromCharCode(65 + answerIndex)}: ${answer}`);
                button.addEventListener("click", () => checkRouteAnswer(answerIndex));
                answerList.append(button);
            });

            const spokenQuestion = `Soal ${quizQuestionIndex + 1} dari 9. ${question.text} Pilihan jawaban: ${
                question.answers.map((answer, index) => `${String.fromCharCode(65 + index)}. ${answer}`).join(". ")
            }.`;
            document.querySelector("#listen-question").dataset.speak = spokenQuestion;
            document.querySelector("#listen-question").setAttribute(
                "aria-label",
                `Dengarkan soal ${quizQuestionIndex + 1} dan pilihan jawaban`
            );
            showRouteScreen("question");
            const heading = document.querySelector("#route-question-title");
            heading.setAttribute("tabindex", "-1");
            heading.focus({ preventScroll: true });
        }

        function showQuizCompletion() {
            showRouteScreen("complete");
            document.querySelector("#quiz-result").textContent =
                `Kamu berhasil menjawab ${quizScore} dari ${quizQuestionOrder.length} soal.`;
            document.querySelector("#quiz-complete-title").setAttribute("tabindex", "-1");
            document.querySelector("#quiz-complete-title").focus({ preventScroll: true });
        }

        function showRouteQuestion() {
            showRouteScreen("question");
        }

        function checkRouteAnswer(answerIndex) {
            const question = quizQuestionOrder[quizQuestionIndex];
            if (!question || routeAnswerSubmitted || answerIndex < 0 || answerIndex >= question.answers.length) return;

            const answerButtons = document.querySelectorAll("#route-answer-list button");
            answerButtons.forEach((button) => {
                button.setAttribute("aria-pressed", "false");
            });
            answerButtons[answerIndex].setAttribute("aria-pressed", "true");

            const correct = question.answers[answerIndex] === getExpectedAnswer(question);
            if (correct) {
                routeAnswerSubmitted = true;
                quizScore++;
                const positiveMessages = [
                    "Hebat! Jawabanmu benar!",
                    "Pintar sekali!",
                    "Yeay, kamu berhasil!"
                ];
                document.querySelector("#route-feedback").textContent =
                    positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
                document.querySelector("#quiz-hint").hidden = true;
                document.querySelector("#quiz-star-burst").hidden = false;
                answerButtons.forEach((button) => {
                    button.disabled = true;
                });
                document.querySelector("#route-question-actions").hidden = false;
                return;
            }

            const retryMessages = [
                "Belum tepat, yuk coba lagi!",
                "Tidak apa-apa, ayo coba sekali lagi!",
                "Ayo perhatikan gambar dan coba lagi!"
            ];
            document.querySelector("#route-feedback").textContent =
                retryMessages[Math.floor(Math.random() * retryMessages.length)];
            document.querySelector("#quiz-hint").textContent = `Petunjuk: ${question.hint}`;
            document.querySelector("#quiz-hint").hidden = false;
        }

        function openGameQuiz(startNewSession) {
            const resetSession = startNewSession || quizQuestionOrder.length === 0;
            if (resetSession) {
                startQuizSession();
            }
            document.querySelector("#game-intro").hidden = true;
            document.querySelector("#game-play").hidden = false;
            showPage("game");
            if (resetSession) {
                renderQuizQuestion();
            } else {
                showRouteQuestion();
            }
        }

        document.querySelectorAll("[data-go]").forEach((button) => {
            button.addEventListener("click", () => {
                if (button.dataset.go === "game") {
                    openGameQuiz(true);
                    return;
                }
                showPage(button.dataset.go);
            });
        });

        document.querySelector("#start-button").addEventListener("click", () => {
            showPage("menu");
        });

        listenButton.addEventListener("click", () => {
            if (speechActive) {
                stopSpeech();
                status.textContent = "Sambutan dihentikan.";
            } else {
                speakWelcome();
            }
        });

        document.querySelectorAll("[data-topic]").forEach((button) => {
            button.addEventListener("click", () => {
                const lesson = lessonDetails[button.dataset.topic];
                document.querySelector("#lesson-title").textContent = lesson.title;
                document.querySelector("#lesson-description").textContent = lesson.description;
                document.querySelector("#lesson-detail").hidden = false;
            });
        });

        document.querySelector("#begin-game").addEventListener("click", () => {
            openGameQuiz(false);
        });

        document.querySelector("#return-to-intro").addEventListener("click", () => {
            showRouteQuestion();
            document.querySelector("#route-question-title").focus();
        });

        document.querySelector("#show-game-intro").addEventListener("click", () => {
            document.querySelector("#game-play").hidden = true;
            document.querySelector("#game-intro").hidden = false;
            document.querySelector("#game-title").setAttribute("tabindex", "-1");
            document.querySelector("#game-title").focus();
        });

        document.querySelector("#practice-routes").addEventListener("click", () => {
            showRouteScreen("routes");
            document.querySelector("#route-screen-title").setAttribute("tabindex", "-1");
            document.querySelector("#route-screen-title").focus();
        });

        document.querySelector("#instruction-back").addEventListener("click", () => {
            document.querySelector("#instruction-done").disabled = true;
            showRouteScreen("routes");
            document.querySelector("#route-screen-title").focus();
        });

        document.querySelector("#repeat-activity").addEventListener("click", () => {
            resetCarActivity();
        });

        document.querySelector("#next-instruction").addEventListener("click", () => {
            advanceRouteInstruction();
        });

        document.querySelector("#instruction-done").addEventListener("click", () => {
            if (document.querySelector("#instruction-done").disabled) return;
            showRouteQuestion();
        });

        document.querySelector("#car-position-slider").addEventListener("input", (event) => {
            updateCarFromSlider(event.currentTarget.value);
        });
        document.querySelector("#car-position-slider").addEventListener("change", () => {
            completeCarWaypoint();
        });

        document.querySelector("#next-quiz-question").addEventListener("click", () => {
            if (!routeAnswerSubmitted) return;
            quizQuestionIndex++;
            if (quizQuestionIndex >= quizQuestionOrder.length) {
                showQuizCompletion();
                return;
            }
            renderQuizQuestion();
        });

        document.querySelector("#restart-quiz").addEventListener("click", () => {
            startQuizSession();
            renderQuizQuestion();
        });

        document.querySelector("#finish-to-menu").addEventListener("click", () => {
            showPage("menu");
        });

        document.querySelectorAll("[data-speak]").forEach((button) => {
            button.addEventListener("click", () => speakExplanation(button.dataset.speak));
        });

        document.querySelector("#accessibility-toggle").addEventListener("click", (event) => {
            const button = event.currentTarget;
            const enabled = button.getAttribute("aria-pressed") !== "true";
            document.querySelector("#game-intro").classList.toggle("accessible", enabled);
            button.setAttribute("aria-pressed", String(enabled));
            button.setAttribute("aria-label", enabled ? "Matikan mode aksesibilitas" : "Aktifkan mode aksesibilitas");
        });

        window.addEventListener("popstate", (event) => {
            const pageName = event.state && pages[event.state.page] ? event.state.page : "home";
            showPage(pageName, false);
        });

        window.addEventListener("DOMContentLoaded", () => {
            history.replaceState({ page: "home" }, "", `${location.pathname}${location.search}#home`);
            renderRouteCards();
            status.textContent = "Tekan Dengarkan sambutan untuk memutar suara.";
        });
