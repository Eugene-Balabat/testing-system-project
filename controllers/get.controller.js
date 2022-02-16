class GetController {
  async getCookie(req, res) {
    console.log(req.cookies)
    res.json({ tatus: 'ok' })
  }
}

module.exports = new GetController()
