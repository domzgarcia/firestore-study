(() => {
	const cafeList = document.querySelector('#cafe-list')
	const form = document.querySelector('#add-cafe-form')

	function renderCafe(doc){
		const li = document.createElement('li')
		const name = document.createElement('span')
		const city = document.createElement('span')
		const cross = document.createElement('div')

		li.setAttribute('data-id', doc.id)
		name.textContent = doc.data().name
		city.textContent = doc.data().city
		cross.textContent = 'x'

		li.appendChild(name)
		li.appendChild(city)
		li.appendChild(cross)
		
		cafeList.appendChild(li)

		cross.addEventListener('click', (e) => {
			e.stopPropagation()
			let id = e.target.parentElement.getAttribute('data-id')
			db.collection('cafes').doc(id).delete()
		})
	}

	/**
	* (1) Getting all
	* (2) Query using where(field,operator,value) ~ this is casesensitive - you can use ==,<,>
	* (3) Create an order - capital letters come first lower case letters
	* (4) Create index when do complex query, will throw an error (The query requires an index)
	*/
	// (1) const snapshots = await db.collection('cafes').get()
	// (2) const snapshots = await db.collection('cafes').where('city','==','Landmark').get()
	// (3) const snapshots = await db.collection('cafes').orderBy('city').get()
	// (4) const snapshots = await db.collection('cafes').where('city','==','Pasig').orderBy('name').get()
	// snapshots.docs.forEach( (doc) => {
	// 	renderCafe(doc)
	// })

	db.collection('cafes').orderBy('city').onSnapshot( (snapshot) => {
		let changes = snapshot.docChanges()
		changes.forEach( (change) => {
			if(change.type === 'added'){
				renderCafe(change.doc)
			}else if(change.type === 'removed'){
				let li = cafeList.querySelector('[data-id='+change.doc.id+']')
				cafeList.removeChild(li)
			}
		})
	})

	form.addEventListener('submit', (e) => {
		e.preventDefault()
		db.collection('cafes')
		.add({name: form.name.value, city: form.city.value })
		form.name.value = ''
		form.city.value = ''
	})
})()