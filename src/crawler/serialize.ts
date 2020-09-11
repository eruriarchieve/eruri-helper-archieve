import Serializable from './serializable';

// JSON 객체로 평면화 시킨다
export default function serialize(o: Serializable | Serializable[] | undefined) {
  if (!o) return o;
  if (Array.isArray(o)) {
    return o.map((e) => e.serialize());
  }
  return o.serialize();
}
