# Async Programming 101
## Callbacks

What a way of resuming your code after some kind of "disjoint" operation, async operation.

- A callback is a function, where the parameters of the function is the response of the disjoint operation
- One way to think of this is the function is almost like a phone number. Suppose the senario,
	
	- You go to the dry cleaners, and you are only able to do one thing at a time (representative of that fact that JS is single threaded)
	- You go and say okay, I want my clothes to be dried - and the person, the API, tells you okay it'll be done in 10 minutes
	- Suppose you wait all ten minutes.
		```
		// My program would wait here for 10 minutes, before the next
		// dryMyClothes = send function in lab5
		let myDryClothes = dryMyClothes(wetClothes);
		// ... Do stuff + handle clothes
		```
	    - This is bad, the whole website is frozen for 10 minutes, no events or any kind of DOM manipulation by JS would run for this duration
	    - The benefit however, is that its pretty easy and intuitive because its like a normal function
	    - Note that JS doesn't really allow you to do this. It knows its bad, and you're forced to use a callback via `.onload`
    - But there's a better way, use callbacks
	    - Instead of waiting around, you leave your "phone number" - which is your callback function.
	    - And when your clothes is done, they call you back and you come pick up your clothes - the params of the callback
		    ```
		    dryMyClothes(wetClothes, dryClothes => {
			    // ... Handle clothes
			})
			// Do stuff
		    ```
		    - Looking at just the code itself, you're able to do stuff **while** your clothes is drying.
		    - Hence, you "save on time", less idle time.

## Promises

 - Why not just callbacks all the way?
 - What if we to do alot of things, like dryMyClothes, pickUpTakeout, goToReservation
 
 ```
	 dryMyClothes(wetClothes, dryClothes => {
		// Idk, these are you're only set of clothes
		pickUpTakeout(dryClothes, takeout => {
			// Idk its covid, your reservation is with takeout while keeping social distancing ;)
			goToReservation(takeout, atRes => {
				// Do stuff like eat...
				// Suppose this chain just keeps going...
			});
		});
	 });
 ```
-	- This code look super messy and dank, and the nestedness makes it very ugly and hard to read - This is called **callback hell**.
	- Okay what if we made it look slightly more appealing, and with some "structure" - `.then`, `.catch`, `.finally`.
		![](https://mdn.mozillademos.org/files/15911/promises.png)
	```
	dryMyClothes(wetClothes).then(dryClothes => {
		return pickUpTakeout(dryClothes);
	}).then(takeout => {
		return goToReservation(takeout);
	}).then(atRes => {
		// Do stuff like eat...
	});
	```

	 - Looks better, but to even start a promise, still looks pretty nasty (but better)
	   ```
	   function dryMyClothes(wetClothes) {
		   return new Promise((resolve, reject) => {
			   const placedClothes = putIntoDrier(wetClothes);
			   waitForClothes(placedClothes).then(driedClothes => {
				   resolve(driedClothes);
			   });
		   });
	   }
    ```
 
	  -Can we do better?

### Aside (Fancy Promise tools)

#### What if I want to do stuff in parallel?

```
	Promise.all([
		doA, // These are promises like what is shown above
		doB,
		doC,
		doD,
	]).then(results => {
		// Only runs when all promises are resolved
		// results = [ resultA, resultB, resultC, resultD ]
	}).catch(...).finally(...);
```

## Async/await

- This is basically syntatical sugar for promises - The specific detail is that it's like a python generator, where if the "promise" is a promise, then it does `.then` - otherwise uses `yield`.
- Async is just a function decorator, and it more or less just makes your function return a promise.

```
async function doAsync() {
	// await ...
	return result;
}

doAsync() // returns a promise, which resolves result
``` 
- So what does it look like?
```
const dryClothes = await dryMyClothes(wetClothes);
const takeout = await pickUpTakeout(dryClothes);
const atRes = await goToReservation(takeout);
```

 - What about finally and catch?
 ```
	 try {
		 const dryClothes = await dryMyClothes(wetClothes);
		const takeout = await pickUpTakeout(dryClothes);
		const atRes = await goToReservation(takeout);
	 } catch (err) {
		 // Handle error
	 } finally {
		 // Regardless of what (in UI, usually to cleanup state like remove current item or whatnot)
	 }
``` 


## Summary
 - Callbacks are general and common topic, but is pred to promises since callbacks are used heavily in promises as well.
 - Promises are more specific and tailored for async programming, with appropriate handing built in, and allows for **actual async code** (Also there's some queue priority and whatnot, but thats just super indepth JS)
 - Async/await is just sugar on top, to make it all look cooler and fancier. But should know the stuff before it, interviewers love digging into people who use fancy es3000