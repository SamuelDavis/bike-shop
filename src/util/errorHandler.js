export default function (err) {
    console.error(err.error && err.error.error ? err.error.error : err)
}
