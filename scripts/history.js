const accordionElement = document.getElementById("accordion");

const appendHistory = (title, desc, index) => {
	const codeToAppend = `
<div class="card text-white bg-dark mb-1">
  <div class="card-header" id="headingOne">
    <h5 class="mb-0">
      <button class="btn btn-link" data-toggle="collapse" data-target="#collapse${index}" aria-expanded="true" aria-controls="collapse${index}">
        ${title}
      </button>
    </h5>
  </div>

  <div id="collapse${index}" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
    <div class="card-body">
    ${desc}  
    </div>
  </div>
</div>
`;

	accordionElement.insertAdjacentHTML("beforeend", codeToAppend);
};
let localHistory;

document.addEventListener("DOMContentLoaded", async (event) => {
	const response = await chrome.storage.local
		.get(["localHistory"])
		.then((result) => {
			// alert("Value currently is " + result.localHistory);
			return result;
		});
	localHistory = JSON.parse(response.localHistory) || [];
	let count = 0;
	localHistory.forEach((item) => {
		appendHistory(item.message, item.response, ++count);
	});
});
