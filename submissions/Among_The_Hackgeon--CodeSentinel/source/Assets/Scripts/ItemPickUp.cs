using UnityEngine;

public enum ItemType {
    Ammo,
    Healing,
    Weapon,
    Blank,
    Special,
    Key,
}
public class ItemPickUp : MonoBehaviour {
    public string _name;
    public int _amount;
    public ItemType _itemType;
    public Transform _pickupParticle;
    void Awake() {
        if (_itemType == ItemType.Weapon) {
            GetComponent<SpriteRenderer>().sprite = GameDataManager.LoadWeaponByName(_name)._sprite;
        }
    }
    void OnTriggerEnter2D(Collider2D other) {
        if (other.CompareTag("Player")) {
            var p = other.gameObject.GetComponent<PlayerController>();
            p._currentItemInRange = this;

        }

    }
    void OnTriggerExit2D(Collider2D other) {
        if (other.CompareTag("Player")) {
            var p = other.gameObject.GetComponent<PlayerController>();
            if (p._currentItemInRange == this) p._currentItemInRange = null;
        }
    }
    void OnDestroy() {
        Instantiate(_pickupParticle, transform.position, Quaternion.identity);
    }

}
