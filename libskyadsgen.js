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
            /* Basic styling for the modal */
            .${modalClass} {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            
            /* Fullscreen modal content */
            .${modalContentClass} {
                border: 1px solid red;
                background: #fff;
                padding: 0px;
                width: 100%;
                height: 100%;
                object-fit: contain;
                overflow: hidden;
                max-width: none; /* Remove any max-width limit */
                max-height: none; /* Remove any max-height limit */
                box-sizing: border-box; /* Include padding and border in element's total width and height */
                overflow: hidden; /* Allow scrolling if content overflows */
                position: relative;
                display: flex;
                justify-content: center; 
                align-items: center;
            }
            
            /* Styling for the close button */
            .${closeButtonClass} {
                position: fixed; /* Absolute relative to the viewport */
                top: 20px;
                right: 20px;
                cursor: pointer;
                font-size: 30px;
                color: #000;
                z-index: 1001; /* Ensure the button is above the modal content */
                padding: 5px; /* Optional: Add some padding around the button */
                border-radius: 50%; /* Optional: Make the button round */
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

  const content = document.createElement("div");
  content.id = `modalBody-${generateHash(8)}`;

  modalContent.appendChild(closeButton);
  modalContent.appendChild(content);
  modal.appendChild(modalContent);

  document.body.appendChild(modal);

  // Return modal components with alias
  return {
    modal: {
      element: modal,
      open: (modalContent) => {
        content.innerHTML = modalContent;
        modal.style.display = "flex";

        // Show the close button after 5 seconds
        setTimeout(() => {
          closeButton.style.display = "block";
        }, 5000);
      },
      close: () => {
        modal.style.display = "none";
      },
    },
    content,
    closeButton,
  };
};

// Initialize modal
const { modal, content, closeButton } = createModal();

// Function to handle API response and open the modal
const handleApiResponse = async () => {
  try {
    // Replace with your API URL
    // const response = await fetch("https://api.example.com/getAdContent");
    // if (!response.ok) {
    //   throw new Error("Network response was not ok");
    // }
    // const data = await response.json();
    // const adContent = data.content; // Assume API returns { content: '...' }
    console.log("adasd");
    modal.open(`
        <video src="https://videos.pexels.com/video-files/27099933/12071850_2560_1440_24fps.mp4" autoplay muted=false>
          Your browser does not support the video tag.
        </video>
      `);
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

// Start polling every 30 seconds (30000 milliseconds)
startPolling(15000);

// Event listener for the close button
closeButton.addEventListener("click", () => {
  modal.close();
});
