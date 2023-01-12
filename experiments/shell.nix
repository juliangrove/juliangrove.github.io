let nixpkgs_source = (fetchTarball https://github.com/NixOS/nixpkgs/archive/nixos-22.05.tar.gz);
in
{ pkgs ? import nixpkgs_source {
    inherit system;
  }
, system ? builtins.currentSystem
}:
let
  python-packages = py-pkgs: with py-pkgs; [
    boto3
    # matplotlib
    # numpy
    # pandas
    # pygments
    # scikit-learn
    # tensorflowWithoutCuda
  ];
  python-stuff = pkgs.python38.withPackages python-packages;
in
pkgs.stdenv.mkDerivation {
  name = "my-env-0";
  buildInputs = [
    python-stuff
  ];
  shellHook = ''
    export LANG=C.UTF-8
    export LC_ALL=C.UTF-8
    # export LANG=en_US.UTF-8
    # export LOCALE_ARCHIVE=/usr/lib/locale/locale-archive
    eval $(egrep ^export ${python-stuff}/bin/python)
  '';
}
