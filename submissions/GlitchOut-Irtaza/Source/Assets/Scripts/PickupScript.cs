using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PickupScript : MonoBehaviour
{
    public GameObject player;
    public Transform holdPos;
    public float throwForce = 500f; // Force at which the object is thrown
    public float pickUpRange = 5f; // Range to pick up objects
    private float rotationSensitivity = 1f; // Rotation sensitivity
    private GameObject heldObj; // Currently held object
    private Rigidbody heldObjRb; // Rigidbody of held object
    private bool canDrop = true; // To prevent throwing while rotating
    private int LayerNumber; // Layer index

    // Reference to script which includes mouse movement of player (looking around)
    // We want to disable the player looking around when rotating the object
    // MouseLookScript mouseLookScript;

    void Start()
    {
        LayerNumber = LayerMask.NameToLayer("Grabbable"); // Ensure the layer is correctly named

        // mouseLookScript = player.GetComponent<MouseLookScript>();
    }

    void Update()
    {
        if (Input.GetKey(KeyCode.E)) // Holding E to pick up or drop object
        {
            if (heldObj == null) // If not holding anything
            {
                // Perform raycast to check if player is looking at an object within pickUpRange
                RaycastHit hit;
                if (Physics.Raycast(transform.position, transform.TransformDirection(Vector3.forward), out hit, pickUpRange))
                {
                    // Ensure the object has the "canPickUp" tag
                    if (hit.transform.gameObject.CompareTag("canPickUp"))
                    {
                        // Call PickUpObject method
                        PickUpObject(hit.transform.gameObject);
                    }
                }
            }
            else
            {
                // Move the object with the player
                MoveObject();
                RotateObject();

                // Throw the object when left mouse button is clicked
                if (Input.GetKeyDown(KeyCode.Mouse0) && canDrop)
                {
                    StopClipping();
                    ThrowObject();
                }
            }
        }
        else if (heldObj != null) // Release object if E is released
        {
            if (canDrop)
            {
                StopClipping();
                DropObject();
            }
        }
    }

    void PickUpObject(GameObject pickUpObj)
    {
        if (pickUpObj.GetComponent<Rigidbody>()) // Check if the object has a Rigidbody
        {
            heldObj = pickUpObj; // Set the held object
            heldObjRb = pickUpObj.GetComponent<Rigidbody>(); // Get the Rigidbody
            heldObjRb.isKinematic = true; // Disable physics while holding
            heldObjRb.transform.parent = holdPos; // Parent object to hold position
            // heldObj.layer = LayerNumber; // Change the object layer
            // Ignore collision with player
            Physics.IgnoreCollision(heldObj.GetComponent<Collider>(), player.GetComponent<Collider>(), true);
        }
    }

    void DropObject()
    {
        // Re-enable collision with player
        Physics.IgnoreCollision(heldObj.GetComponent<Collider>(), player.GetComponent<Collider>(), false);
        heldObj.layer = 7; // Reset the object layer
        heldObjRb.isKinematic = false; // Re-enable physics
        heldObj.transform.parent = null; // Unparent the object
        heldObj = null; // Clear the held object
    }

    void MoveObject()
    {
        // Keep the object at the hold position
        heldObj.transform.position = holdPos.position;
    }

    void RotateObject()
    {
        if (Input.GetKey(KeyCode.R)) // Hold R to rotate the object
        {
            canDrop = false; // Disable dropping while rotating

            // Disable player looking around
            // mouseLookScript.verticalSensitivity = 0f;
            // mouseLookScript.lateralSensitivity = 0f;

            float XaxisRotation = Input.GetAxis("Mouse X") * rotationSensitivity;
            float YaxisRotation = Input.GetAxis("Mouse Y") * rotationSensitivity;
            // Rotate the object based on mouse movement
            heldObj.transform.Rotate(Vector3.down, XaxisRotation);
            heldObj.transform.Rotate(Vector3.right, YaxisRotation);
        }
        else
        {
            // Re-enable player looking around
            // mouseLookScript.verticalSensitivity = originalvalue;
            // mouseLookScript.lateralSensitivity = originalvalue;
            canDrop = true;
        }
    }

    void ThrowObject()
    {
        // Similar to DropObject but with force applied
        Physics.IgnoreCollision(heldObj.GetComponent<Collider>(), player.GetComponent<Collider>(), false);
        heldObj.layer = 0;
        heldObjRb.isKinematic = false;
        heldObj.transform.parent = null;
        heldObjRb.AddForce(transform.forward * throwForce); // Apply force to throw the object
        heldObj = null; // Clear the held object
    }

    void StopClipping()
    {
        var clipRange = Vector3.Distance(heldObj.transform.position, transform.position);
        RaycastHit[] hits = Physics.RaycastAll(transform.position, transform.TransformDirection(Vector3.forward), clipRange);
        if (hits.Length > 1)
        {
            heldObj.transform.position = transform.position + new Vector3(0f, -0.5f, 0f); // Prevent clipping
        }
    }
}
