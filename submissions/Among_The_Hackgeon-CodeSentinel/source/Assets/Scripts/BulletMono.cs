using MyUtils.Interfaces;
using MyUtils.Structs;
using Unity.Mathematics;
using UnityEngine;

public class BulletMono : MonoBehaviour {
    public float _bulletDamage = 10;
    public float _speed = 4;
    private Vector3 _startPos;
    public float _maxDist = 5;
    public LayerMask _layerToIgnore;
    public string _tagToIgnore;
    private Collider2D col;
    private Rigidbody2D _rgb;
    void Awake() {
        _startPos = transform.position;
        col = GetComponent<Collider2D>();
        _rgb = col.GetComponent<Rigidbody2D>();
    }

    void FixedUpdate() {
        float dist = Vector3.Distance(_startPos, transform.position);
        if (dist < _maxDist) {
            _rgb.velocity = _speed * transform.up; //* transform.rotation;
        } else Destroy(transform.parent.gameObject);

    }
    public void Setup(BulletSetting s, float bSMult, LayerMask layerToIgnore, string tag) {
        _bulletDamage = s._damage;
        _speed = s._speed * bSMult;
        _maxDist = s._maxDist;
        _tagToIgnore = tag;
        _layerToIgnore = layerToIgnore;

    }
    void OnCollisionEnter2D(Collision2D col) {
        Debug.Log($"Collision with{col.gameObject.name}");
        if (col.collider.isTrigger) return;
        if (col.gameObject.layer == gameObject.layer) return;
        if (col.gameObject.CompareTag(_tagToIgnore)) { Physics2D.IgnoreCollision(col.gameObject.GetComponent<Collider2D>(), this.col); return; }
        if (col.gameObject.CompareTag("Bullet")) { Physics2D.IgnoreCollision(col.gameObject.GetComponent<Collider2D>(), this.col); return; }

        IDamageable unit = col.gameObject.GetComponent<IDamageable>();
        if (unit != null) {
            unit.Damage(_bulletDamage);
        } else {
            Instantiate(GameDataManager._I._collisionParticle, transform.position, quaternion.identity);
        }
        Destroy(transform.parent.gameObject);
    }
}
