const io = require("socket.io")(3001,
  {
    cors:
    {
      origin: "http://localhost:3000",
      methods: ["GET", 'POST']
    }
  }
);

// MongoDB imports here
const mongoose = require('mongoose');
const JotPad = require('./JotPad');

console.log('requires launched')

mongoose.connect('mongodb://localhost/jot-down-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

console.log('mongoose connected')
const defaultValue = ''


io.on("connection", async socket => {
  const j = await findAllJotters();
  socket.emit("get-sidebar", j)

  socket.on("get-document", async documentid => {
    const jotPad = await findOrCreateJotPad(documentid)
    socket.join(documentid)

    socket.emit("load-document", jotPad.data)
    socket.on("send-changes", delta =>
    {
      //We want to broadcast to everyone that isn't us that changes have been made.
      socket.broadcast.to(documentid).emit("receive-changes", delta)
    })

    socket.on("save-document", async data => {
      await JotPad.findByIdAndUpdate(documentid,{ data: data})
    })
  })
})

async function findOrCreateJotPad(id) {

  if (id == null) return


  const jotPad = await JotPad.findById(id)
  //If it exists then we just want to return it
  if (jotPad) return jotPad
  //Otherwise
  return await JotPad.create({_id: id, data: defaultValue, user: "UNKNOWN"})

}


async function findAllJotters()
{
  var jotters = await JotPad.find({})
  console.log('jotter found:' + jotters);
  var jotterList = []
  for (let i = 0; i < jotters.length; i++){
    jotterList.push([jotters[i]._id, jotters[i].data]);
  }

  return jotterList
}
