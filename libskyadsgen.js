(function () {
	// Utility function to generate a random hash-like string
	const generateHash = (length) => {
		const chars =
			"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		let result = "";
		for (let i = 0; i < length; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return result;
	};

	// Generate unique class and ID names
	const modalAlias = generateHash(8);
	const modalClass = `modal-${modalAlias}`;
	const modalContentClass = `modal-content-${modalAlias}`;
	const closeButtonClass = `close-${modalAlias}`;
	const modalId = `myModal-${modalAlias}`;

	// Create and style the modal container
	const createModal = () => {
		// Create a style element and add CSS rules
		const style = document.createElement("style");
		style.textContent = `
	.${modalClass} {
		display: none;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: transparent;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.${modalContentClass} {
		background: #000;
		padding: 0;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		flex-direction: column;
		position: relative;
	}

	.${closeButtonClass} {
		text-shadow: 0 0 3px #000;
		font-weight: bold;
		position: fixed;
		top: 20px;
		right: 20px;
		font-size: 35px;
		color: white;
		z-index: 1001;
		border-radius: 50%;
	}

	.countdown {
		text-shadow: 0 0 3px #000;
		position: fixed;
		top: 20px;
		right: 20px;
		font-size: 20px;
		color: white;
		z-index: 1001;
	}

	.${modalContentClass} video {
		width: 100%;
		height: 100%;
		object-fit: cover;
		flex-grow: 1;
	}

	.modal-footer {
		background-color: #fff;
		width: 100%;
		text-align: center;
		padding: 10px;
		color: #000;
		font-size: 14px;
		position: absolute;
		bottom: 0;
		left: 0;
	}

	.slideshow-container {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: black;
	}

	.slideshow-container img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
        `;
		document.head.appendChild(style);

		// Create the modal and its content
		const modal = document.createElement("div");
		modal.id = modalId;
		modal.className = modalClass;

		const modalContent = document.createElement("div");
		modalContent.className = modalContentClass;

		const closeButton = document.createElement("span");
		closeButton.className = closeButtonClass;
		closeButton.innerHTML = "&times;";
		closeButton.style.display = "none"; // Hide the close button initially

		const countdown = document.createElement("span");
		countdown.className = "countdown";
		countdown.style.display = "none"; // Hide the countdown initially

		const content = document.createElement("div");
		content.id = `modalBody-${generateHash(8)}`;

		const footer = document.createElement("div");
		footer.className = "modal-footer";
		footer.textContent = "Powered by Sky Ads";

		modalContent.appendChild(closeButton);
		modalContent.appendChild(countdown);
		modalContent.appendChild(content);
		modal.appendChild(modalContent);
		modal.appendChild(footer);
		document.body.appendChild(modal);

		// Return modal components with alias
		return {
			modal: {
				element: modal,
				open: (modalContent, seconds) => {
					content.innerHTML = modalContent;
					modal.style.display = "flex";
					let countdownValue = seconds; // Countdown from specified seconds

					countdown.textContent = `${countdownValue}s`;
					countdown.style.display = "block";
					closeButton.style.display = "none"; // Ensure close button is hidden at the start

					const countdownInterval = setInterval(() => {
						countdownValue -= 1;
						countdown.textContent = `${countdownValue}s`;

						if (countdownValue <= 0) {
							clearInterval(countdownInterval);
							countdown.style.display = "none";
							closeButton.style.display = "block";
						}
					}, 1000);
				},
				close: () => {
					modal.style.display = "none";
					countdown.style.display = "none"; // Ensure countdown is hidden when modal is closed
					closeButton.style.display = "none"; // Reset close button display state
				},
			},
			content,
			closeButton,
			countdown,
		};
	};

	// Initialize modal
	const { modal, content, closeButton, countdown } = createModal();

	function createVideoAdsContainer(url) {
		return `
  <video src="${url}" autoplay loop muted=false>
    Your browser does not support the video tag.
  </video>
`;
	}

	function createSlideShowAdsContainer(imageUrls) {
		console.log(imageUrls);
		return `
 <div class="slideshow-container">
					${imageUrls
						.map(
							(src, index) =>
								`<img class="slide" src="${src}" style="display: ${
									index === 0 ? "block" : "none"
								};">`
						)
						.join("")}
				</div>
`;
	}

	// Function to handle API response and open the modal
	const handleApiResponse = async () => {
		try {
			// Get the key from the script tag
			const scriptTag = document.querySelector(
				'script[data-name*="skyadsgen"]'
			);
			const apiKey = scriptTag?.getAttribute("data-key");

			if (!apiKey) {
				throw new Error("API key is missing.");
			}

			// Replace with your API URL, including the API key
			const response = await fetch(
				`http://localhost:7575/api/cloud/cams/adsEngine?key=${apiKey}`
			);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			const adContent = await response.json();

			// Display the advertisements based on type
			if (adContent.type === "video") {
				modal.open(
					createVideoAdsContainer(adContent.content),
					adContent.duration
				);
			} else if (adContent.type === "image") {
				modal.open(
					createSlideShowAdsContainer(adContent.content),
					adContent.duration
				);

				let slideIndex = 0;
				const slides = document.querySelectorAll(".slide");
				const showSlide = (n) => {
					slides.forEach((slide, i) => {
						slide.style.display = i === n ? "block" : "none";
					});
				};

				// Automatically switch slides every 3 seconds
				setInterval(() => {
					slideIndex = (slideIndex + 1) % slides.length;
					showSlide(slideIndex);
				}, 3000);
			}
		} catch (error) {
			console.error("There was a problem with the fetch operation:", error);
		}
	};

	// Polling function to continuously request data from the API
	const startPolling = (interval) => {
		handleApiResponse(); // Initial call to fetch data
		// Set interval to repeatedly fetch data
		setInterval(() => {
			handleApiResponse();
		}, interval);
	};

	// Start polling every 15 seconds (15000 milliseconds)
	startPolling(15000);

	// Handle page visibility change
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "visible") {
			handleApiResponse();
		}
	});

	// Event listener for the close button
	closeButton.addEventListener("click", () => {
		modal.close();
	});
})();
