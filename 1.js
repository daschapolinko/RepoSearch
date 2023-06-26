const u = 'https://api.github.com/search/repositories?q='

const search_c = document.querySelector('.search-container')
const search_i = document.querySelector('#search')
const chosen_c = document.querySelector('.chosen-container')

function debounce(callee, timeoutMs) {
  return function perform(...args) {
    let previousCall = this.lastCall
    this.lastCall = Date.now()
    if (previousCall && this.lastCall - previousCall <= timeoutMs) {
      clearTimeout(this.lastCallTimer)
    }
    this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs)
  }
}

search_i.addEventListener('keydown', debounce(e => {
  if (search_c.children.length > 1) search_c.removeChild(search_c.lastChild)
  if (e.target.value.trim()) getR(u + e.target.value)
}, 1000))

search_c.addEventListener('click', e => {
  if (e.target.className === "autocomplete__result") {
    search_c.removeChild(search_c.lastChild)
    search_i.value = ''
    chosen_c.appendChild(createRepo(e.target.info))
  }
})

chosen_c.addEventListener('click', e => {
  if (e.target.textContent === '+') {
    chosen_c.removeChild(e.target.parentNode)
  }
})

function getR(url) {
  fetch(url)
    .then(response => response.json())
    .then(r => {
      search_c.appendChild(createAutocomplete(r))
    })
}

function createAutocomplete(repos) {
  let div = document.createElement('div')
  div.classList.add('autocomplete')
  for (let i = 0; i < 5; i++) {
    let result = document.createElement('div')
    result.textContent = `${repos.items[i].name}`
    result.info = {
      name: repos.items[i].name,
      owner: repos.items[i].owner.login,
      stars: repos.items[i].stargazers_count
  }
    result.classList.add('autocomplete__result')
    div.appendChild(result)
  }
  return div
}

function createRepo(repo) {
  let card = document.createElement('div')
  card.classList.add('chosen')
  let div = document.createElement('div')
  let name = document.createElement('div')
  name.textContent = `Name: ${repo.name}`
  let owner = document.createElement('div')
  owner.textContent = `Owner: ${repo.owner}`
  let stars = document.createElement('div')
  stars.textContent = `Stars: ${repo.stars}`
  div.appendChild(name)
  div.appendChild(owner)
  div.appendChild(stars)
  card.appendChild(div)
  let btn = document.createElement('div')
  btn.textContent = '+'
  btn.classList.add('delete-btn')
  card.appendChild(btn)
  return card
}