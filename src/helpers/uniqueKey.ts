export default function uniqueKey() {
  let key = Math.floor(Math.random() * 100000);
  return key.toString();
}
