const list = document.createElement('ul')

for (let i = 0, l = 5; i < l; i++) {
  const item = document.createElement('li')

  item.textContent = `Item #${i}`
  list.appendChild(item)
}

document.body.appendChild(list)

const transition = () => Promise.resolve()

export { list, transition }
