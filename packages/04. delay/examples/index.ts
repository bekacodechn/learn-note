import { logTime } from "helper";
import delay, { clearDelay } from "../dist";

logTime("clearDelay", async () => {
  const delayedPromise = delay(2000, { value: "Done" });

  setTimeout(() => {
    clearDelay(delayedPromise);
  }, 700);

  console.log(await delayedPromise);
});

logTime('delay', async () => {
	console.log(1)
	await delay(1200)
	console.log(2)
})
