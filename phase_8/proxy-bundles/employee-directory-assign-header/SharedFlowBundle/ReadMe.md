## creating Shared FLow : 


-->  follow the strucure : https://docs.cloud.google.com/apigee/docs/api-platform/reference/shared-flow-bundle-configuration-reference#sharedflowbundlestructure


--> understand the stucture : 


### Shared Flow Structure (`employee-directory-common-security`)

The `employee-directory-common-security` folder is an Apigee Shared Flow bundle designed to encapsulate reusable, cross-cutting logic—such as security and traffic management—so it can be invoked across multiple API proxies.

Its standard directory layout follows Apigee’s bundle specifications:

* **`employee-directory-common-security.xml`** *(Root Configuration)*: The base manifest file containing bundle metadata, a list of included policies, and references to available shared flows.
* **`policies/`**: Contains the XML configuration files conforming to Apigee policy schemas (e.g., Spike Arrest, Quota limits, and API Key verification).
* **`resources/`** *(Optional)*: Holds custom scripts (like JavaScript or Java JARs) referenced by your policies for advanced execution logic.
* **`sharedflows/`**: Contains the execution pipeline files (such as `default.xml`) that define the chronological sequence in which the policies execute.



--> then write the root folder (base folder )

### Root Configuration (`employee-directory-common-security.xml`)

The root configuration file acts as the central metadata **manifest** for the entire shared flow bundle. It sits directly inside the main `sharedflow/` folder and informs Apigee of the bundle's structure, components, and behavior.

#### Key Elements Explained:
* **`<SharedFlowBundle>`**: The root wrapper element containing attributes like `name` (the unique bundle identifier) and `revision`.
* **`<ConfigurationVersion>`**: Specifies the underlying Apigee major and minor schema versions.
* **`<Description>` & `<DisplayName>`**: Human-readable metadata describing the purpose of the shared flow bundle in the Apigee UI.
* **`<Policies>`**: A collection listing all the individual policy files (e.g., Spike Arrest, Quota, Verify API Key) included within this bundle.
* **`<Resources>`**: Lists any auxiliary custom assets, such as JavaScript files (`jsc://...`), JARs, or XSLT referenced by the policies.
* **`<SharedFlows>`**: Declares the execution pipelines available in this bundle, typically pointing to `default` (which maps to `sharedflows/default.xml`).

--> implemented all policy from policies in sharedflows default.xml 