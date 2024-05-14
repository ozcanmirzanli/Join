const STORAGE_TOKEN = "CDWXOVPDT01MKZ60CIJW2K95MBKWUP1IFUHRH575";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

/**
 * Stores an item in remote storage.
 *
 * This function sends a POST request to the remote storage service to save a key-value pair.
 * It uses a predefined storage token for authentication.
 *
 * @async
 * @param {string} key - The key under which the value will be stored.
 */
async function setItem(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}

/**
 * Retrieves an item from remote storage.
 *
 * This function sends a GET request to the remote storage service to fetch the value associated
 * with a specified key. It uses a predefined storage token for authentication.
 *
 * @async
 * @param {string} key - The key for which the value needs to be retrieved.
 */
async function getItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url)
    .then((res) => res.json())
    .then((res) => res.data.value);
}

// Attaching functions to window object for global accessibility
window.setItem = setItem;
window.getItem = getItem;